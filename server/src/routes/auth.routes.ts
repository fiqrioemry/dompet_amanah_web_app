import { Router } from "express";
import * as ctrl from "../controllers/auth.controller";
import validate from "../middlewares/validate.middleware";
import * as schema from "../validations/schema.validation";
import isAuthenticated from "../middlewares/auth.middleware";

const router = Router();

router.post("/verify-otp", validate(schema.verifyOtpSchema), ctrl.verifyOTP);
router.post("/send-otp", validate(schema.sendOtpSchema), ctrl.sendOTP);
router.post("/register", validate(schema.registerSchema), ctrl.register);
router.post("/login", validate(schema.loginSchema), ctrl.login);
router.post("/logout", isAuthenticated, ctrl.logout);
router.post("/refresh", isAuthenticated, ctrl.refresh);
router.post("/reset-password", ctrl.resetPassword);
schema;
router.post("/change-password", isAuthenticated, ctrl.changePassword);

export default router;
