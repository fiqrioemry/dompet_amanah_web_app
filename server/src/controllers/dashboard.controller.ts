import db from "../models";
import { fn, col } from "sequelize";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const getProgramStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await db.Program.findAll({
      attributes: ["status", [fn("COUNT", col("id")), "total"]],
      group: ["status"],
    });

    const formatted = stats.reduce((acc: any, curr: any) => {
      acc[curr.status] = parseInt(curr.get("total"));
      return acc;
    }, {});

    res.json({ statistics: formatted });
  }
);

export const getDonationSummaryByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const totalDonations = await db.Donation.count({
      where: { userId, paymentStatus: "paid" },
    });

    const totalAmount = await db.Donation.sum("amount", {
      where: { userId, paymentStatus: "paid" },
    });

    res.json({
      totalDonations,
      totalAmount: totalAmount || 0,
    });
  }
);

export const getDashboardOverview = asyncHandler(
  async (req: Request, res: Response) => {
    const [userCounts, totalPrograms, totalDonations, totalRevenue] =
      await Promise.all([
        db.User.findAll({
          attributes: ["role", [fn("COUNT", col("id")), "count"]],
          group: ["role"],
        }),
        db.Program.count(),
        db.Donation.count({ where: { paymentStatus: "paid" } }),
        db.Donation.sum("amount", { where: { paymentStatus: "paid" } }),
      ]);

    const userByRole = userCounts.reduce((acc: any, user: any) => {
      acc[user.role] = parseInt(user.get("count"));
      return acc;
    }, {});

    res.json({
      users: userByRole,
      totalPrograms,
      totalDonations,
      totalRevenue: totalRevenue || 0,
    });
  }
);
