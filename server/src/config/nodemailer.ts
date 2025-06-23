import dotenv from "dotenv";
import { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

dotenv.config();

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL as string,
    pass: process.env.USER_PASSWORD as string,
  },
  tls: { rejectUnauthorized: false },
});

export default transporter;
