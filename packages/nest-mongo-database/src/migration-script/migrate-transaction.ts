import mongoose from 'mongoose';

export const migrateTransaction = async (
  client: typeof mongoose,
  cb: (session: mongoose.ClientSession) => Promise<void>,
) => {
  const session = await client.startSession();
  session.startTransaction();
  try {
    await cb(session);
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
