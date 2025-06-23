import { Router } from "express";

import roleOnly from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";
import isAuthenticated from "../middlewares/auth.middleware";
import * as logCtrl from "../controllers/programLog.controller";

const router = Router();

router.post(
  "/:id/logs",
  isAuthenticated,
  roleOnly("admin", "reviewer"),
  upload().single("image"),
  logCtrl.createProgramLog
);

router.get("/:id/logs", logCtrl.getProgramLogsByProgram);

export default router;
