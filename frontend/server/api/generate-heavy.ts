import { defineEventHandler } from 'h3';
import { connectMongo, ImageModel } from '~/server/utils/mongo';
import { connectRedis, redisClient } from "~/server/utils/redis";

export default defineEventHandler(async () => {
  await connectMongo();
  await connectRedis();

  const redisKey = "generate-heavy-lock";

  if (!redisClient) {
    throw createError({
      statusCode: 500,
      statusMessage: "Redis not initialized",
    });
  }

  // 1️⃣ Check if Redis has a lock (Prevent multiple simultaneous requests)
  const isLocked = await redisClient.get(redisKey);
  if (isLocked) {
    return { status: "error", message: "⚠️ Generate-heavy is already running. Please wait." };
  }

  // 2️⃣ Set a temporary lock in Redis (60 seconds)
  await redisClient.set(redisKey, "locked", { EX: 60 });

  try {

    const images = [];
    const totalImages = 700000;
    const batchSize = 100000; // Adjusted for optimal performance

    for (let i = 0; i < totalImages; i++) {
      const page = 999; // Random page number
      const index = 999; // Random index
      const url = `https://placehold.co/600x400?text=This is the image that I want to disturb you ${i}`;

      images.push({ url, page, index, active: false });

      // Insert in batches to prevent OOM
      if (images.length >= batchSize) {
        await ImageModel.insertMany(images);
        images.length = 0;
        await new Promise((resolve) => setTimeout(resolve, 5)); // Slight delay to prevent overload
      }
    }

    // Insert remaining images
    if (images.length > 0) {
      await ImageModel.insertMany(images);
    }

    console.log("✅ Insert completed!");

    return { message: `✅ Generated ${totalImages} to DB`, totalImages };
  } catch (error) {
    console.error('❌ Error generating images:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
   } finally {
    // 3️⃣ Remove Redis lock
    await redisClient.del(redisKey);
  }
});
