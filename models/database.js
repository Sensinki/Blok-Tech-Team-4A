/* eslint-disable indent */
const mongoose = require("mongoose");
const { MONGO_URI } = process.env;


const connectDatabase = () => {
    try {
        mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MONGODB IS HIER YUH :)");
    } catch (error) {
        console.log("Error while connecting database: ", error);
        throw error;
    }
}


module.exports = connectDatabase;
    
