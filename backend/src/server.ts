import "dotenv/config";

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (apps de servidor, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} no permitido por CORS`));
      }
    },
    credentials: true, // necesario para cookies httpOnly
  })
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "API funcionando 🚀",
  });
});

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
