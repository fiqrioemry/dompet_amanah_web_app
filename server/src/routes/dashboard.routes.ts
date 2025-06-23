import { Router } from "express";

import roleOnly from "../middlewares/role.middleware";
import isAuthenticated from "../middlewares/auth.middleware";
import * as dashboardCtrl from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/overview",
  isAuthenticated,
  roleOnly("admin"),
  dashboardCtrl.getDashboardOverview
);

router.get(
  "/statistics",
  isAuthenticated,
  roleOnly("admin"),
  dashboardCtrl.getProgramStatistics
);

router.get(
  "/my-donation-summary",
  isAuthenticated,
  roleOnly("donor"),
  dashboardCtrl.getDonationSummaryByUser
);

export default router;
