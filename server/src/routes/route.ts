import { Application } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import receiptRoutes from "./receipt.routes";
import programRoutes from "./program.routes";
import donationRoutes from "./donation.routes";
import dashboardRoutes from "./dashboard.routes";
import programLogRoutes from "./programLog.routes";
import programAuditRoutes from "./programAudit.routes";

import apiKey from "../middlewares/api.middleware";

const initRoutes = (app: Application): void => {
  app.use("/api/v1/auth", apiKey, authRoutes);
  app.use("/api/v1/users", apiKey, userRoutes);
  app.use("/api/v1/programs", apiKey, programRoutes);
  app.use("/api/v1/receipts", apiKey, receiptRoutes);
  app.use("/api/v1/donations", apiKey, donationRoutes);
  app.use("/api/v1/dashboard", apiKey, dashboardRoutes);
  app.use("/api/v1/program-logs", apiKey, programLogRoutes);
  app.use("/api/v1/program-audits", apiKey, programAuditRoutes);
};

export default initRoutes;
