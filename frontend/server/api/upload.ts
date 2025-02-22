import { defineEventHandler, readMultipartFormData } from 'h3';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No files uploaded' });
  }

  const urls: string[] = [];

  for (const file of formData) {
    const fileName = `${Date.now()}-${file.filename}`;
    const filePath = join('public/uploads', fileName);
    await writeFile(filePath, file.data);
    urls.push(`/uploads/${fileName}`);
  }

  return { urls };
});
