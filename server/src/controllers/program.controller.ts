import db from "../models";
import { Op } from "sequelize";
import ApiError from "../errors/ApiError";
import { Request, Response } from "express";
import { paginate } from "../utils/paginate";
import asyncHandler from "express-async-handler";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploader";

export const createProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { title, description, target_amount, deadline } = req.body;
    const file = req.file;

    const transaction = await db.sequelize.transaction();
    try {
      if (!file?.buffer) {
        throw new ApiError(400, "Image is required");
      }

      const uploadedImage = await uploadToCloudinary(file.buffer);

      const program = await db.Program.create(
        {
          title,
          description,
          target_amount,
          deadline,
          image_url: uploadedImage.secure_url,
          createdBy: userId,
        },
        { transaction }
      );

      await transaction.commit();
      res.status(201).json({ message: "Program created", program });
    } catch (error) {
      await transaction.rollback();
      throw new ApiError(401, "Invalid credentials");
    }
  }
);

export const updateProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, target_amount, deadline, status } = req.body;
    const file = req.file;

    const program = await db.Program.findByPk(id);
    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    const transaction = await db.sequelize.transaction();
    try {
      if (file?.buffer) {
        const uploadedImage = await uploadToCloudinary(file.buffer);

        if (program.image_url) {
          await deleteFromCloudinary(program.image_url);
        }

        program.image_url = uploadedImage.secure_url;
      }

      program.title = title || program.title;
      program.description = description || program.description;
      program.target_amount = target_amount || program.target_amount;
      program.deadline = deadline || program.deadline;
      program.status = status || program.status;

      await program.save({ transaction });
      await transaction.commit();

      res.json({ message: "Program updated", program });
    } catch (error) {
      await transaction.rollback();
      throw new ApiError(500, "Failed to update program");
    }
  }
);

export const deleteProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const program = await db.Program.findByPk(id);

    if (!program) {
      throw new ApiError(404, "Program not found");
    }
    const transaction = await db.sequelize.transaction();
    try {
      if (program.image_url) {
        await deleteFromCloudinary(program.image_url);
      }

      await program.destroy({ transaction });

      await transaction.commit();

      res.json({ message: "Program deleted" });
    } catch (error: any) {
      await transaction.rollback();
      res;
      throw new ApiError(500, "Failed to delete program");
    }
  }
);

export const getAllPrograms = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, q, page, limit } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (q) where.title = { [Op.iLike]: `%${q}%` };

    const result = await paginate(
      db.Program,
      {
        where,
        include: [
          {
            model: db.User,
            as: "creator",
            attributes: ["id", "name", "email", "avatar"],
          },
          { model: db.Donation },
          { model: db.ProgramLog },
        ],
        order: [["createdAt", "DESC"]],
      },
      page as string,
      limit as string
    );

    res.json(result);
  }
);

export const getProgramById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const program = await db.Program.findByPk(id, {
      include: [
        { model: db.User, as: "creator", attributes: ["id", "name", "email"] },
        { model: db.Donation },
        { model: db.ProgramLog },
        { model: db.ProgramAudit },
      ],
    });

    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    res.json({ program });
  }
);

export const activateProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const program = await db.Program.findByPk(id);
    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    if (program.status !== "draft") {
      throw new ApiError(400, "Only draft programs can be activated");
    }

    program.status = "active";
    await program.save();

    res.json({ message: "Program activated", program });
  }
);

export const completeProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const program = await db.Program.findByPk(id);
    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    if (program.status !== "active") {
      throw new ApiError(400, "Only active programs can be completed");
    }

    program.status = "completed";
    await program.save();

    res.json({ message: "Program marked as completed", program });
  }
);

export const cancelProgram = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const program = await db.Program.findByPk(id);
    if (!program) {
      throw new ApiError(404, "Program not found");
    }

    if (program.status === "completed") {
      throw new ApiError(400, "Completed programs cannot be cancelled");
    }

    program.status = "cancelled";
    await program.save();

    res.json({ message: "Program cancelled", program });
  }
);
