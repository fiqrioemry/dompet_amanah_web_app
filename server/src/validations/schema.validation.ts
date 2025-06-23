import Joi from "joi";

// 1. Send OTP
export const sendOtpSchema = Joi.object({
  email: Joi.string().email().required(),
});

// 2. Verify OTP
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

// 3. Register
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

// 4. Login
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
