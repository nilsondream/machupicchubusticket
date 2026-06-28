import "dotenv/config";

import express from "express";
import authRoutes from "./modules/auth/auth.routes";
import { configureMiddleware } from "./config/middleware.config";

const app = express();
const apiRouter = express.Router();

// Inicializar middlewares externos
configureMiddleware(app);

// Ruta base de la API
app.get("/api", (_, res) => {
  res.json({ message: "API funcionando 🚀" });
});

apiRouter.use("/auth", authRoutes);

app.use("/api", apiRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
