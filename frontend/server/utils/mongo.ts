import mongoose, { Schema, Document } from 'mongoose';

let dbConnected = false;

// Ensure MongoDB connects only once
async function connectMongo() {
  if (!dbConnected) {
    await mongoose
      .connect('mongodb://mongo:27017/mydb')
      .then(() => {
        dbConnected = true;
        console.log('✅ Connected to MongoDB');
      })
      .catch((err) => console.error('❌ MongoDB connection failed:', err));
  }
}

// Define TypeScript interface for Image documents
interface IImage extends Document {
  url: string;
  createdAt: Date;
}

// Prevent model overwrite error
const ImageModel =
  mongoose.models.Image || mongoose.model<IImage>('Image', new Schema<IImage>({
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }));

export { connectMongo, ImageModel };
