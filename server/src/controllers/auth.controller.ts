import {
  clearAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/cookies";
import db from "../models";

import redis from "../config/redis";
import ApiError from "../errors/ApiError";
import getRandomUserAvatar from "../utils/avatar";
import { sendOTP as sendOTPEmail } from "../utils/mailer";
import { generateToken, verifyToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/hash";

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// 1. Send OTP
export const sendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const otpKey = `otp:${email}`;
  const attemptKey = `otp_attempt:${email}`;

  const attempts = await redis.incr(attemptKey);
  if (attempts === 1) await redis.expire(attemptKey, 1800);
  if (attempts > 3) throw new ApiError(429, "Too many OTP requests");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.setex(otpKey, 600, otp);
  await sendOTPEmail(email, otp);

  res.json({ message: "OTP sent" });
});

// 2. Verify OTP
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const otpKey = `otp:${email}`;
  const savedOtp = await redis.get(otpKey);

  if (!savedOtp || savedOtp !== otp)
    throw new ApiError(400, "Invalid or expired OTP");
  await redis.del(otpKey);

  res.json({ message: "OTP verified" });
});

// 3. Register
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const exists = await db.User.findOne({ where: { email } });
  if (exists) throw new ApiError(409, "Email already registered");

  const user = await db.User.create({
    name,
    email,
    password: await hashPassword(password),
    avatar: getRandomUserAvatar(name),
    role: "user",
  });

  const accessToken = generateToken(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    "15m"
  );
  const refreshToken = generateToken(
    { id: user.id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET!,
    "7d"
  );

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({ message: "Registration successful" });
});

// 4. Login
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const attemptKey = `login_attempt:${email}`;

  const attempts = await redis.incr(attemptKey);
  if (attempts === 1) await redis.expire(attemptKey, 1800);
  if (attempts > 5) throw new ApiError(429, "Too many login attempts");

  const user = await db.User.findOne({ where: { email } });
  if (!user || !(await comparePassword(password, user.password)))
    throw new ApiError(401, "Invalid credentials");

  await redis.del(attemptKey);

  const accessToken = generateToken(
    { id: user.id, email: user.email, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    "15m"
  );
  const refreshToken = generateToken(
    { id: user.id, email: user.email, role: user.role },
    process.env.REFRESH_TOKEN_SECRET!,
    "7d"
  );

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);

  res.json({ message: "Login successful" });
});

// 5. Logout
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ message: "Logout successful" });
});

// 6. Refresh Token
export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.access_token;
  if (!token) throw new ApiError(401, "Not authenticated");

  const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
  const newToken = generateToken(
    { id: decoded.id, email: decoded.email, role: decoded.role },
    process.env.ACCESS_TOKEN_SECRET!,
    "1h"
  );

  setAccessTokenCookie(res, newToken, 3600000);
  res.json({ message: "Token refreshed" });
});

// 7. Reset Password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const otpKey = `otp:${email}`;
    const savedOtp = await redis.get(otpKey);

    if (!savedOtp || savedOtp !== otp)
      throw new ApiError(400, "Invalid or expired OTP");

    const user = await db.User.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    user.password = await hashPassword(newPassword);
    await user.save();

    await redis.del(otpKey);
    res.json({ message: "Password has been reset" });
  }
);

// 8. Change Password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await db.User.findByPk(userId);
    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) throw new ApiError(401, "Current password is incorrect");

    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password has been changed" });
  }
);
