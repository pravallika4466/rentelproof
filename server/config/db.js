import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.includes('<MY_MONGODB_URI>') || mongoUri === 'your_mongodb_connection_string') {
    console.warn('\n[RentalProof] Warning: MONGODB_URI is not configured or contains a placeholder.');
    console.warn('[RentalProof] Please set a valid MONGODB_URI in your .env file to enable database operations.\n');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[RentalProof] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[RentalProof] MongoDB Connection Error: ${error.message}`);
  }
};

export default connectDB;
