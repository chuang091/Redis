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
    // Get pagination query parameters
    const { page = 1, limit = 10 } = getQuery(event);
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Redis cache key for pagination
    const cacheKey = `images_page_${pageNum}_limit_${limitNum}`;

    // Try to fetch from Redis cache
    const cachedImages = await redisClient.get(cacheKey);
    if (cachedImages) {
      console.log('⚡ Serving images from Redis cache');
      return JSON.parse(cachedImages);
    }

    // Fetch images from MongoDB if cache is empty
    const images = await ImageModel.find()
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

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
