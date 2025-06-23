import dotenv from "dotenv";
import cors from "cors";
import initRoutes from "./routes/route";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import errorHandler from "./errors/errorHandler";
import limiter from "./middlewares/limiter.middleware";

dotenv.config();

const app: Application = express();

// Middleware
app.use(limiter);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
initRoutes(app);

// Error Handler
app.use(errorHandler);

export default app;
