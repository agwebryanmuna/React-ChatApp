import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully ✅");
  } catch (error) {
    console.log("Failed to connect to database ❌", error);
  }
};
