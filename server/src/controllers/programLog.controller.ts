import db from "../models";
import ApiError from "../errors/ApiError";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { uploadToCloudinary } from "../utils/uploader";

export const createProgramLog = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { programId, note, status } = req.body;
    const file = req.file;

    const program = await db.Program.findByPk(programId);
    if (!program) throw new ApiError(404, "Program not found");

    const transaction = await db.sequelize.transaction();
    try {
      let imageUrl = null;

      if (file?.buffer) {
        const uploaded = await uploadToCloudinary(file.buffer);
        imageUrl = uploaded.secure_url;
      }

      const log = await db.ProgramLog.create(
        {
          programId,
          updatedBy: userId,
          note,
          status,
          imageUrl,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json({ message: "Log created", log });
    } catch (err) {
      await transaction.rollback();
      throw new ApiError(500, "Failed to create program log");
    }
  }
);

export const getProgramLogsByProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { programId } = req.params;

    const logs = await db.ProgramLog.findAll({
      where: { programId },
      include: [
        { model: db.User, as: "Updater", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({ logs });
  }
);
