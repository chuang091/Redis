import { defineEventHandler } from 'h3';
import { Image } from '~/types/image';

export default defineEventHandler(async () => {
  const fs = await import('fs/promises');

  // load all files from the uploads directory
  const files = await fs.readdir('./public/uploads');

  // return an array of Image objects
  const images: Image[] = files.map((file) => ({
    id: file,
    url: `/uploads/${file}`,
    createdAt: new Date().toISOString(),
  }));

  return images;
});
