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
    const { page = '1', active = 'true' } = getQuery(event);
    const pageNum = parseInt(page as string, 10);
    const isActive = active === 'true';

    // Redis cache key
    const cacheKey = `images_page_${pageNum}_active_${isActive}`;

    // Try to fetch from Redis
    const cachedImages = await redisClient.get(cacheKey);
    if (cachedImages) {
      console.log(`⚡ Cache Hit: Serving images from Redis [${cacheKey}]`);
      return JSON.parse(cachedImages);
    }

    console.log(`🛠 Cache Miss: Fetching from MongoDB [${cacheKey}]`);
    const images = await ImageModel.find({ page: pageNum, active: isActive }).sort({ index: 1 });

    if (images.length === 0) {
      return { message: 'No images found' };
    }

    // Store in Redis cache (10 minutes expiration)
    await redisClient.setEx(cacheKey, 600, JSON.stringify(images));

    return images;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
