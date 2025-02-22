import { defineEventHandler } from 'h3';
import { connectMongo, ImageModel } from '~/server/utils/mongo';

export default defineEventHandler(async () => {
  await connectMongo();

  try {

    const images = [];
    const totalImages = 700000;
    const batchSize = 1000;

    for (let i = 0; i < totalImages; i++) {
      const page = 99; // random page number
      const index = 99; // random index
      const url = `https://placehold.co/600x400?text=This is the image that I want to disturb you ${i}`;

      images.push({ url, page, index, active: false });

      if (images.length >= batchSize) {
        await ImageModel.insertMany(images);
        images.length = 0; 
        await new Promise((resolve) => setTimeout(resolve, 1)); // sleep for 1ms
      }
    }

    // leftover images
    if (images.length > 0) {
      await ImageModel.insertMany(images);
    }

    return { message: `✅ Generated ${totalImages} images`, totalImages };
  } catch (error) {
    console.error('❌ Error generating images:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
