import { Router } from "express";

import roleOnly from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";
import * as programCtrl from "../controllers/program.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  isAuthenticated,
  roleOnly("admin"),
  upload().single("image"),
  programCtrl.createProgram
);

router.put(
  "/:id",
  isAuthenticated,
  roleOnly("admin"),
  upload().single("image"),
  programCtrl.updateProgram
);

router.delete(
  "/:id",
  isAuthenticated,
  roleOnly("admin"),
  programCtrl.deleteProgram
);

router.get("", programCtrl.getAllPrograms);

router.get("/:id", programCtrl.getProgramById);

router.patch(
  "/:id/activate",
  isAuthenticated,
  roleOnly("admin"),
  programCtrl.activateProgram
);

router.patch(
  "/:id/complete",
  isAuthenticated,
  roleOnly("admin"),
  programCtrl.completeProgram
);

router.patch(
  "/:id/cancel",
  isAuthenticated,
  roleOnly("admin"),
  programCtrl.cancelProgram
);

export default router;
