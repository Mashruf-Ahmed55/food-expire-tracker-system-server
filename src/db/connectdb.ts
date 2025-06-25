import mongoose from 'mongoose';
export const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  const mongoDbName = process.env.MONGO_DB_NAME;
  try {
    const connection = await mongoose.connect(mongoUri as string, {
      dbName: mongoDbName,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
