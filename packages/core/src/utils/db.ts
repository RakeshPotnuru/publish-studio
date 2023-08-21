import mongoose from "mongoose";

import defaultConfig from "../config/app.config";

const connectDB = async () => {
    try {
        await mongoose.connect(defaultConfig.mongoURI);
        if (mongoose.connection.readyState === mongoose.STATES.connected) {
            console.log("✅ Connected to MongoDB 🍃");
        } else {
            console.log("❌ Failed to connect to MongoDB 🍃");
        }
    } catch (error) {
        console.log(error);
    }
};

await connectDB().catch(error => {
    console.log(error);
});
