import mongoose from "mongoose";
import { DB_URL } from "../libs/secret";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL as string);
    console.log('Database is connected successfully.');

    mongoose.connection.on('error', (error) => {
      console.log('DB connection error: ', error);
    });
  } catch (error: any) {
    console.log('DB could not connect: ', error?.message);
  }
};
export default connectDB