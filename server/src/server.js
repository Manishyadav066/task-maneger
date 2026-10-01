require("dotenv").config();

console.log("JWT_SECRET LOADED:", process.env.JWT_SECRET ? "YES" : "NO");
console.log("MONGO_URI EXISTS:", !!process.env.MONGO_URI);

if (process.env.MONGO_URI) {
  try {
    const host = new URL(process.env.MONGO_URI).hostname;
    console.log("MONGO HOST:", host);
  } catch (error) {
    console.log("MONGO URI FORMAT INVALID");
  }
}

const mongoose = require("mongoose");
const app = require("./app");
const { seedInitialData } = require("./utils/seedData");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing");
  process.exit(1);
}

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
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  });