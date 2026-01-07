import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

    async function connectToDatabase() {
        try {
            const mongoUri ="mongodb+srv://task_and_approval_system:B3h9%40NYFQ9knYx%23@cluster0.nqfqhh6.mongodb.net/task_and_approval_system?retryWrites=true&w=majority";
            await mongoose.connect(mongoUri as string);
            console.log('MongoDB connection successfully established.');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            process.exit(1); // Exit process on connection failure
        }
    }

    export default connectToDatabase;