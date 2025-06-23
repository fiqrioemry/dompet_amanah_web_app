import { Application } from "express";
import authRoutes from "./auth.routes";
import apiKey from "../middlewares/api.middleware";

const initRoutes = (app: Application): void => {
  app.use("/api/v1/auth", apiKey, authRoutes);
};

export default initRoutes;
