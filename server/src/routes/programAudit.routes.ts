import { Router } from "express";

import roleOnly from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";
import isAuthenticated from "../middlewares/auth.middleware";
import * as auditCtrl from "../controllers/programAudit.controller";

const router = Router();

router.post(
  "/:id/audits",
  isAuthenticated,
  roleOnly("reviewer"),
  upload().single("image"),
  auditCtrl.createProgramAudit
);

router.get("/:id/audits", auditCtrl.getProgramAuditsByProgram);

router.patch(
  "/:id/verify",
  isAuthenticated,
  roleOnly("admin"),
  auditCtrl.verifyProgramAudit
);

export default router;
