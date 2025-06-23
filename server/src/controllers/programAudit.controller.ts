import db from "../models";
import ApiError from "../errors/ApiError";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { uploadToCloudinary } from "../utils/uploader";

export const createProgramAudit = asyncHandler(
  async (req: Request, res: Response) => {
    const reviewerId = req.user?.id;
    const { programId, comment } = req.body;
    const file = req.file;

    const program = await db.Program.findByPk(programId);
    if (!program) throw new ApiError(404, "Program not found");

    const transaction = await db.sequelize.transaction();
    try {
      let imageUrl = null;

      if (file?.buffer) {
        const upload = await uploadToCloudinary(file.buffer);
        imageUrl = upload.secure_url;
      }

      const audit = await db.ProgramAudit.create(
        {
          programId,
          reviewerId,
          comment,
          imageUrl,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json({ message: "Audit submitted", audit });
    } catch (err) {
      await transaction.rollback();
      throw new ApiError(500, "Failed to create audit");
    }
  }
);

export const getProgramAuditsByProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { programId } = req.params;

    const audits = await db.ProgramAudit.findAll({
      where: { programId },
      include: [
        { model: db.User, as: "Reviewer", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ audits });
  }
);

export const verifyProgramAudit = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const audit = await db.ProgramAudit.findByPk(id);
    if (!audit) throw new ApiError(404, "Audit not found");

    audit.verified = true;
    await audit.save();

    res.json({ message: "Audit verified", audit });
  }
);
