/* eslint-disable indent */

// Import the required dependencies
const mongoose = require("mongoose");
const { MONGO_URI } = process.env;

// Define a function to connect to the database
const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MONGODB IS HIER YUH :)");
    } catch (error) {
        console.log("Error while connecting database: ", error);
        throw error;
    }
};

module.exports = connectDatabase;
