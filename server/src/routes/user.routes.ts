import { Router } from "express";
import validate from "../middlewares/validate.middleware";
import * as schema from "../validations/schema.validation";

import roleOnly from "../middlewares/role.middleware";
import { upload } from "../middlewares/upload.middleware";
import * as userCtrl from "../controllers/user.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", isAuthenticated, userCtrl.getMe);

router.put(
  "/me",
  isAuthenticated,
  upload().single("avatar"),
  userCtrl.updateMe
);

router.get("/", isAuthenticated, roleOnly("admin"), userCtrl.getAllUsers);

router.get("/:id", isAuthenticated, roleOnly("admin"), userCtrl.getUserById);

router.put(
  "/:id/role",
  isAuthenticated,
  roleOnly("admin"),
  userCtrl.updateUserRole
);

router.delete(
  "/:id",
  isAuthenticated,
  roleOnly("admin"),
  userCtrl.deleteUserById
);

export default router;
