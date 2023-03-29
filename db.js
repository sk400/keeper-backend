const mongoose = require("mongoose");

const mongoUrl = "mongodb://127.0.0.1:27017/keeper";

const connectDb = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to mongoDB.");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDb;
