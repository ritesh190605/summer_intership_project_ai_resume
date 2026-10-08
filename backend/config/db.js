import mongoose from "mongoose";

let memoryServer = null;

/**
 * Establishes a connection to MongoDB using Mongoose.
 * In development, falls back to an in-memory MongoDB when Atlas is unreachable.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`[MongoDB] Atlas connection failed: ${error.message}`);
      if (process.env.NODE_ENV === "production") {
        process.exit(1);
      }
    }
  }

  if (process.env.NODE_ENV === "production") {
    console.error("[MongoDB] MONGO_URI is required in production.");
    process.exit(1);
  }

  try {
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    const conn = await mongoose.connect(memoryServer.getUri());
    console.log(`[MongoDB] Using in-memory fallback: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`[MongoDB] In-memory fallback failed: ${error.message}`);
    console.warn("[MongoDB] Running without database — save/submit features will be unavailable.");
    return false;
  }
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

export default connectDB;
