import mongoose, { ConnectionStates } from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.readyState === ConnectionStates.connected) {
            console.log("✅ Connected to MongoDB");
        } else {
            console.log("❌ Failed to connect to MongoDB");
        }
    } catch (error) {
        console.log(error);
    }
};

await connectDB().catch(error => {
    console.log(error);
});
