import mongoose from "mongoose";

export const connectDB = async () => {
  const connect = await mongoose.connect(
    "mongodb://127.0.0.1:27017/CuentaTienda"
  );
  console.log(`MongoDB Connected`);
};
