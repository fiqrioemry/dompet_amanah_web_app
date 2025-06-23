import db from "../models";
import ApiError from "../errors/ApiError";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const generateReceipt = asyncHandler(
  async (req: Request, res: Response) => {
    const { donationId, pdfUrl } = req.body;

    if (!donationId || !pdfUrl) {
      throw new ApiError(400, "Donation ID and PDF URL are required");
    }

    const donation = await db.Donation.findByPk(donationId, {
      include: [{ model: db.User }, { model: db.Program }],
    });

    if (!donation) {
      throw new ApiError(404, "Donation not found");
    }

    if (donation.paymentStatus !== "paid") {
      throw new ApiError(
        400,
        "Receipt can only be generated for paid donations"
      );
    }

    const existing = await db.Receipt.findOne({ where: { donationId } });
    if (existing) {
      throw new ApiError(409, "Receipt already exists for this donation");
    }

    const receipt = await db.Receipt.create({
      donationId,
      pdfUrl,
    });

    res.status(201).json({ message: "Receipt generated", receipt });
  }
);

export const getReceiptByDonationId = asyncHandler(
  async (req: Request, res: Response) => {
    const { donationId } = req.params;
    const userId = req.user?.id;

    const donation = await db.Donation.findByPk(donationId);

    if (!donation) {
      throw new ApiError(404, "Donation not found");
    }

    // Pastikan hanya user yang membuat donasi atau admin yang bisa akses
    if (req.user?.role !== "admin" && donation.userId !== userId) {
      throw new ApiError(403, "Unauthorized to view this receipt");
    }

    const receipt = await db.Receipt.findOne({
      where: { donationId },
    });

    if (!receipt) {
      throw new ApiError(404, "Receipt not found");
    }

    res.json({ receipt });
  }
);
