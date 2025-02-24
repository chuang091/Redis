import { defineEventHandler, getQuery } from "h3";
import { connectMongo, ImageModel } from "~/server/utils/mongo";
import { connectRedis, redisClient } from "~/server/utils/redis";
import { performance } from "perf_hooks";

export default defineEventHandler(async (event) => {
  const startTimer = performance.now(); // Start performance timer
  await connectMongo();
  await connectRedis();

  if (!redisClient) {
    throw createError({
      statusCode: 500,
      statusMessage: "Redis not initialized",
    });
  }

  try {
    const { page = "1", active = "true", refresh = "false" } = getQuery(event);
    const pageNum = parseInt(page as string, 10);
    const isActive = active === "true";
    const forceRefresh = refresh === "true";

    // **NonActiveUser: Always fetch from MongoDB, no cache used**
    if (!isActive) {
      console.log(`⚠️ No cache for NonActiveUser: Fetching from MongoDB`);
      const images = await ImageModel.find({ page: pageNum, active: isActive })
        .sort({ createdAt: -1 })
        .limit(50);
      const endTimer = performance.now(); // End performance timer
      return images.length
        ? { status: "success", statusMessage: "Fetched from MongoDB", images, executionTime: `${(endTimer - startTimer).toFixed(2)}ms` }
        : { status: "warn", statusMessage: "No images found", executionTime: `${(endTimer - startTimer).toFixed(2)}ms` };
    }

    // **ActiveUser: Use Redis cache**
    const currentPageKey = `images_page_${pageNum}_active_${isActive}`;
    const prevPageKey = `images_page_${pageNum - 1}_active_${isActive}`;
    const nextPageKey = `images_page_${pageNum + 1}_active_${isActive}`;

    // **Force refresh cache if requested**
    if (forceRefresh) {
      // **Delete 1 - 10 pages**
      for (let i = 1; i <= 10; i++) {
        await redisClient.del(`images_page_${i}_active_${isActive}`);
      }
    }

    // **Check Redis cache first**
    const cachedImages = await redisClient.get(currentPageKey);
    if (cachedImages) {
      console.log(
        `⚡ Cache Hit: Serving images from Redis [${currentPageKey}]`
      );

      // **Prefetch Previous (N-1) and Next (N+1) Pages Asynchronously**
      (async () => {
        console.log(`🔄 Prefetching previous and next pages in the background`);

        // Fetch Previous Page (N-1) if not in cache
        const prevCached = await redisClient.get(prevPageKey);
        if (!prevCached) {
          const prevImages = await ImageModel.find({
            page: pageNum - 1,
            active: isActive,
          })
            .sort({ createdAt: -1 })
            .limit(50);
          if (prevImages.length > 0) {
            await redisClient.set(prevPageKey, JSON.stringify(prevImages));
            console.log(`⏳ Prefetched previous page cache: ${prevPageKey}`);
          }
        }

        // Fetch Next Page (N+1) if not in cache
        const nextCached = await redisClient.get(nextPageKey);
        if (!nextCached) {
          const nextImages = await ImageModel.find({
            page: pageNum + 1,
            active: isActive,
          })
            .sort({ createdAt: -1 })
            .limit(50);
          if (nextImages.length > 0) {
            await redisClient.set(nextPageKey, JSON.stringify(nextImages));
            console.log(`⏳ Prefetched next page cache: ${nextPageKey}`);
          }
        }
      })();

      const endTimer = performance.now(); // End performance timer
      return {
        status: "cache",
        statusMessage: "Loaded from Redis cache",
        executionTime: `${(endTimer - startTimer).toFixed(2)}ms`,
        images: JSON.parse(cachedImages),
      };
    } else {
      console.log(`🛠 Cache Miss: Fetching from MongoDB [${currentPageKey}]`);

      // **Fetch from MongoDB if cache is missed**
      const images = await ImageModel.find({ page: pageNum, active: isActive })
        .sort({ createdAt: -1 })
        .limit(50);

      if (images.length === 0) {
        const endTimer = performance.now(); // End performance timer
        return { status: "warn", statusMessage: "No images found"
          , executionTime: `${(endTimer - startTimer).toFixed(2)}ms`
         };
      }

      // **Store fetched images in Redis cache**
      await redisClient.set(currentPageKey, JSON.stringify(images));

      // **Prefetch previous and next pages**
      const prevImages = await ImageModel.find({
        page: pageNum - 1,
        active: isActive,
      })
        .sort({ createdAt: -1 })
        .limit(50);
      const nextImages = await ImageModel.find({
        page: pageNum + 1,
        active: isActive,
      })
        .sort({ createdAt: -1 })
        .limit(50);

      if (prevImages.length > 0) {
        await redisClient.set(prevPageKey, JSON.stringify(prevImages));
        console.log(`⏳ Prefetched previous page cache: ${prevPageKey}`);
      }

      if (nextImages.length > 0) {
        await redisClient.set(nextPageKey, JSON.stringify(nextImages));
        console.log(`⏳ Prefetched next page cache: ${nextPageKey}`);
      }
      const endTimer = performance.now(); // End performance timer
      return {
        status: "success",
        statusMessage: "Fetched from MongoDB",
        executionTime: `${(endTimer - startTimer).toFixed(2)}ms`,
        images,
      };
    }
  } catch (error) {
    console.error("❌ API Error:", error);
    return { status: "error", statusMessage: "Internal Server Error" };
  }
});
