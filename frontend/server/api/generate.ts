import { defineEventHandler } from 'h3';
import { connectMongo, ImageModel } from '~/server/utils/mongo';

export default defineEventHandler(async () => {
  await connectMongo();

  try {
    // clear all images
    await ImageModel.deleteMany({});

    const images = [];

    let totalPerGroup = 100;

    // generate ActiveUser 100 images
    for (let i = 1; i <= totalPerGroup; i++) {
      const page = Math.ceil(i / 10);
      const index = i % 10 === 0 ? 10 : i % 10;
      const url = `https://placehold.co/600x400?text=Page${page},${index} ActiveUser`;

      images.push({ url, page, index, active: true });
    }

    // generate NonActiveUser 100 images
    for (let i = 1; i <= totalPerGroup; i++) {
      const page = Math.ceil(i / 10);
      const index = i % 10 === 0 ? 10 : i % 10;
      const url = `https://placehold.co/600x400?text=Page${page},${index} NonActiveUser`;

      images.push({ url, page, index, active: false });
    }

    await ImageModel.insertMany(images);
    return { message: '✅ Generated 200 images (100 ActiveUser + 100 NonActiveUser)', images };
  } catch (error) {
    console.error('❌ Error generating images:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
