import dotenv from "dotenv";
import midtransClient from "midtrans-client";

dotenv.config();

const env = process.env.NODE_ENV === "production" ? "Production" : "Sandbox";
const serverKey = process.env.MIDTRANS_SERVER_KEY || "";

// Snap Client
const snap = new midtransClient.Snap({
  isProduction: env === "Production",
  serverKey: serverKey,
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

// Core API Client
const core = new midtransClient.CoreApi({
  isProduction: env === "Production",
  serverKey: serverKey,
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

console.log("✅ Midtrans Snap & Core API clients initialized");

export { snap, core };
