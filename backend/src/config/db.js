import mongoose from "mongoose";

const connectDB = async () => {
    if (!uri) throw new Error ('URI no definido');
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri)
    .then(() => console.log('✅ MongoDB connected'))
}

export default connectDB;