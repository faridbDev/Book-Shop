import mongoose from "mongoose";

const connect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB connected ${connected.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connect;