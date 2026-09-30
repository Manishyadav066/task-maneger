require("dotenv").config();

console.log("JWT_SECRET LOADED:", process.env.JWT_SECRET ? "YES" : "NO");

const mongoose = require("mongoose");
const app = require("./app");
const { seedInitialData } = require("./utils/seedData");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskflow_ai";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedInitialData();
    app.listen(PORT, () => {
      console.log(`TaskFlow AI Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });
