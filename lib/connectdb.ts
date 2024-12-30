import mongoose from 'mongoose';


const connectDB = async () => {
    const mongoURL = process.env.MONGO_URI;
    if (!mongoURL) {
      throw new Error('MONGO_URI is not defined');
    }
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB Connected :)');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }
};


export default connectDB;