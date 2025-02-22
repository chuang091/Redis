import { defineEventHandler, getQuery } from 'h3';
import { connectMongo, ImageModel } from '~/server/utils/mongo';
import { connectRedis, redisClient } from '~/server/utils/redis';

export default defineEventHandler(async (event) => {
  await connectMongo();
  await connectRedis();

  if (!redisClient) {
    throw createError({ statusCode: 500, statusMessage: 'Redis not initialized' });
  }

  try {
    const { page = '1', active = 'true', refresh = 'false' } = getQuery(event);
    const pageNum = parseInt(page as string, 10);
    const isActive = active === 'true';
    const forceRefresh = refresh === 'true';

    // **NonActiveUser: Always fetch from MongoDB, no cache used**
    if (!isActive) {
      console.log(`⚠️ No cache for NonActiveUser: Fetching from MongoDB`);
      const images = await ImageModel.find({ page: pageNum, active: isActive })
        .sort({ createdAt: -1 })
        .limit(50);

      return images.length
        ? { status: 'success', statusMessage: 'Fetched from MongoDB', images }
        : { status: 'warn', statusMessage: 'No images found' };
    }

    // **ActiveUser: Use Redis cache**
    const currentPageKey = `images_page_${pageNum}_active_${isActive}`;
    const prevPageKey = `images_page_${pageNum - 1}_active_${isActive}`;
    const nextPageKey = `images_page_${pageNum + 1}_active_${isActive}`;

    // **Force refresh cache if requested**
    if (forceRefresh) {
      console.log(`🔄 Refreshing cache for ${currentPageKey}`);
      await redisClient.del(currentPageKey);
      await redisClient.del(prevPageKey);
      await redisClient.del(nextPageKey);
    }

    // **Try fetching from Redis cache**
    const cachedImages = await redisClient.get(currentPageKey);
    if (cachedImages) {
      console.log(`⚡ Cache Hit: Serving images from Redis [${currentPageKey}]`);
      return { status: 'cache', statusMessage: 'Loaded from Redis cache', images: JSON.parse(cachedImages) };
    }

    console.log(`🛠 Cache Miss: Fetching from MongoDB [${currentPageKey}]`);

    // **Fetch from MongoDB if cache is missed**
    const images = await ImageModel.find({ page: pageNum, active: isActive })
      .sort({ createdAt: -1 })
      .limit(50);

    if (images.length === 0) {
      return { status: 'warn', statusMessage: 'No images found' };
    }

    // **Store fetched images in Redis cache**
    await redisClient.set(currentPageKey, JSON.stringify(images));

    // **Prefetch previous and next pages**
    const prevImages = await ImageModel.find({ page: pageNum - 1, active: isActive })
      .sort({ createdAt: -1 })
      .limit(50);
    const nextImages = await ImageModel.find({ page: pageNum + 1, active: isActive })
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

    return { status: 'success', statusMessage: 'Fetched from MongoDB', images };
  } catch (error) {
    console.error('❌ API Error:', error);
    return { status: 'error', statusMessage: 'Internal Server Error' };
  }
});
