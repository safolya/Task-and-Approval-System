import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

    async function connectToDatabase() {
        try {
            const mongoUri ="mongodb://127.0.0.1:27017/ttaas";
            await mongoose.connect(mongoUri as string);
            console.log('MongoDB connection successfully established.');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            process.exit(1); // Exit process on connection failure
        }
    }

    export default connectToDatabase;