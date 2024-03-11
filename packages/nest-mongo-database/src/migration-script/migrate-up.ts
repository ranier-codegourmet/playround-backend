import mongoose from 'mongoose';

export const migrateUp = async (
  cb: (client: typeof mongoose) => Promise<void>,
) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  const client = await mongoose.connect(uri);

  await cb(client);

  await mongoose.disconnect();
};
