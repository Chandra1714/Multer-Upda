const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const imageRoutes = require("./routes");

const app = express();

// ✅ CORS - allow requests from Vercel frontend
app.use(cors({
  origin: ["https://multer-fb-2.vercel.app"], // Vercel frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Image routes
app.use("/api/image", imageRoutes);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
