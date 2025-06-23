import { Router } from "express";

import roleOnly from "../middlewares/role.middleware";
import * as donationCtrl from "../controllers/donation.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  roleOnly("donor"),
  donationCtrl.createDonation
);

router.get("/:id", isAuthenticated, donationCtrl.getDonationById);

router.get(
  "/my-donations",
  isAuthenticated,
  roleOnly("donor"),
  donationCtrl.getDonationsByUser
);

router.get(
  "/programs/:id",
  isAuthenticated,
  roleOnly("admin"),
  donationCtrl.getDonationsByProgram
);

router.patch(
  "/:id/status",
  isAuthenticated,
  roleOnly("admin"),
  donationCtrl.updateDonationPaymentStatus
);

export default router;
