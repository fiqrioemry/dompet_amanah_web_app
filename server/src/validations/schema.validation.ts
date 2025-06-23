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

// 5. Category
export const categorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
});

// 6. Create Comment
export const createCommentSchema = Joi.object({
  reportId: Joi.string().uuid().required(),
  content: Joi.string().min(1).max(500).required(),
});

// 7. Update Comment
export const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
});

// 8. Reply
export const replySchema = Joi.object({
  content: Joi.string().min(1).max(500).required(),
});

// 9. Create Notification
export const createNotificationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  reportId: Joi.string().uuid().required(),
  type: Joi.string().valid("comment", "reply").required(),
  message: Joi.string().max(255).required(),
});

// 10. Create Report
export const createReportSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  categoryId: Joi.string().uuid().required(),
});

// 11. Update Report
export const updateReportSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "in_progress", "resolved", "rejected")
    .required(),
  note: Joi.string().max(500).optional(),
});
