import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

dotenv.config();
const app = express();

/*ENV VALIDATION*/
const requiredEnv = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length) {
  console.error(`❌ Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

/* DATABASE*/
connectDB();

/*CORS CONFIG (FIXED)*/
const allowedOrigins = [
  "http://localhost:5173",                 // local dev
  "https://burger-byte-three.vercel.app",  // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser tools (Postman, Render health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);

/* MIDDLEWARE*/
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

/*ROUTES*/

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);

/*HEALTH CHECK (OPTIONAL)*/
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "BurgerByte API" });
});

/*SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
