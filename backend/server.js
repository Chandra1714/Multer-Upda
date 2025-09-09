const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();  // ✅ load .env

const imageRoutes = require("./routes");

const app = express();

// ✅ CORS config for local + any Vercel domain
app.use(cors({
<<<<<<< HEAD
  origin: (origin, callback) => {
    if (!origin || origin === "http://localhost:5173" || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
=======
  origin: [
    "http://localhost:5173",          
    "multer-upda-qdfh.vercel.app" 
  ],
>>>>>>> 4645664d6580b40948007fd57a9c8bf715e1c6cb
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Image routes
app.use("/api/image", imageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
