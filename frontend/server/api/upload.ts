import { defineEventHandler, readMultipartFormData } from 'h3';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectMongo, ImageModel } from '~/server/utils/mongo';
import { connectRedis, redisClient } from '~/server/utils/redis';

export default defineEventHandler(async (event) => {
  await connectMongo();
  await connectRedis();

  if (!redisClient) {
    throw createError({ statusCode: 500, statusMessage: 'Redis not initialized' });
  }

  try {
    // Read multipart form data (supports multiple file uploads)
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
    }

    // Ensure upload directory exists
    await mkdir('public/uploads', { recursive: true });

    const urls: string[] = [];

    for (const file of formData) {
      if (!file.filename || !file.data) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid file data' });
      }

      // Generate unique filename
      const fileName = `${Date.now()}-${file.filename}`;
      const filePath = join('public/uploads', fileName);
      await writeFile(filePath, file.data);
      const fileUrl = `/uploads/${fileName}`;

      // Store image metadata in MongoDB
      const newImage = await ImageModel.create({ url: fileUrl });

      // Store the latest 100 images in Redis
      await redisClient.lPush('recent_images', JSON.stringify(newImage));
      await redisClient.lTrim('recent_images', 0, 99);

      urls.push(fileUrl);
    }

    return { urls };
  } catch (error) {
    console.error('❌ Upload API Error:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
