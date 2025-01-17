const mongoose = require("mongoose");
const MONGODBURI = process.env.DATABASE_URI;
const connectDB = async () => {
  await mongoose.connect(MONGODBURI);
};

module.exports = connectDB;
