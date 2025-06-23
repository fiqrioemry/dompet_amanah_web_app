import { Router } from "express";

import roleOnly from "../middlewares/role.middleware";
import isAuthenticated from "../middlewares/auth.middleware";
import * as receiptCtrl from "../controllers/receipt.controller";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  roleOnly("admin"),
  receiptCtrl.generateReceipt
);
router.get("/:donationId", isAuthenticated, receiptCtrl.getReceiptByDonationId);

export default router;
