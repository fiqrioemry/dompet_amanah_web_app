import db from "../models";
import ApiError from "../errors/ApiError";
import { snap } from "../config/midtrans";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const createDonation = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { programId, amount, paymentMethod } = req.body;

    const program = await db.Program.findByPk(programId);
    if (!program) throw new ApiError(404, "Program not found");

    const donation = await db.Donation.create({
      userId,
      programId,
      amount,
      paymentStatus: "pending",
      paymentMethod,
    });

    const orderId = `donation-${donation.id}`;
    const user = await db.User.findByPk(userId);

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: user.name,
        email: user.email,
      },
      enabled_payments: ["gopay", "bank_transfer", "qris", "credit_card"],
    });

    // Simpan paymentRef
    donation.paymentRef = orderId;
    await donation.save();

    res.status(201).json({
      message: "Donation created",
      donation,
      payment: {
        snapToken: transaction.token,
        snapURL: transaction.redirect_url,
      },
    });
  }
);

export const getDonationById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const donation = await db.Donation.findByPk(id, {
      include: [
        { model: db.Program, attributes: ["id", "title", "deadline"] },
        { model: db.Receipt },
      ],
    });

    if (!donation) throw new ApiError(404, "Donation not found");
    if (donation.userId !== userId && req.user?.role !== "admin") {
      throw new ApiError(403, "Access denied");
    }

    res.json({ donation });
  }
);

export const getDonationsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { page = "1", limit = "10" } = req.query;

    const currentPage = parseInt(page as string, 10);
    const perPage = parseInt(limit as string, 10);
    const offset = (currentPage - 1) * perPage;

    const { rows, count } = await db.Donation.findAndCountAll({
      where: { userId },
      include: [{ model: db.Program, attributes: ["id", "title", "deadline"] }],
      order: [["createdAt", "DESC"]],
      offset,
      limit: perPage,
    });

    res.json({
      total: count,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(count / perPage),
      donations: rows,
    });
  }
);

export const getDonationsByProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { programId } = req.params;
    const { page = "1", limit = "10" } = req.query;

    const currentPage = parseInt(page as string, 10);
    const perPage = parseInt(limit as string, 10);
    const offset = (currentPage - 1) * perPage;

    const { rows, count } = await db.Donation.findAndCountAll({
      where: { programId },
      include: [{ model: db.User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
      offset,
      limit: perPage,
    });

    res.json({
      total: count,
      page: currentPage,
      limit: perPage,
      totalPages: Math.ceil(count / perPage),
      donations: rows,
    });
  }
);

// webhook to update donation payment status
// This endpoint is called by Midtrans to update the donation status
export const updateDonationPaymentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { transaction_status, order_id, payment_type, fraud_status } =
      req.body;

    const donationId = order_id.replace("donation-", "");
    const donation = await db.Donation.findByPk(donationId, {
      include: [{ model: db.Program }],
    });

    if (!donation) {
      throw new ApiError(404, "Donation not found");
    }

    if (donation.paymentStatus === "paid") {
      throw new ApiError(400, "Already processed");
    }

    donation.paymentMethod = payment_type;

    if (
      ["settlement", "capture"].includes(transaction_status) &&
      (fraud_status === "accept" || fraud_status === "")
    ) {
      donation.paymentStatus = "paid";

      // Tambah dana ke program
      donation.Program.collected_amount += donation.amount;
      await donation.Program.save();
    } else if (transaction_status === "pending") {
      donation.paymentStatus = "pending";
    } else {
      donation.paymentStatus = "failed";
    }

    await donation.save();

    res.json({ message: "Donation status updated" });
  }
);
