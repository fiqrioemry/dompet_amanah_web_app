import db from "../models";
import { Op } from "sequelize";
import ApiError from "../errors/ApiError";
import { Request, Response } from "express";
import { paginate } from "../utils/paginate";
import asyncHandler from "express-async-handler";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/uploader";

// ✅ Get Profile Data
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const user = await db.User.findById(userId).select("-password -__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user });
});

// ✅ Update Profile (name, avatar)
export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  const userId = req.user?.id;
  let { name, avatar } = req.body;

  const user = await db.User.findById(userId).select("-password -__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let uploadedImage;

  if (file?.buffer) {
    try {
      uploadedImage = await uploadToCloudinary(file.buffer);

      // delete old avatar if it exists
      if (user.avatar) {
        await deleteFromCloudinary(user.avatar);
      }

      avatar = uploadedImage.secure_url;
    } catch (error) {
      throw new ApiError(500, "Failed to upload image");
    }
  }

  if (user.name !== name) {
    user.name = name;
  }

  if (user.avatar !== avatar) {
    user.avatar = avatar;
  }

  await user.save();

  res.json({ message: "profile updated", user });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, role, page, limit } = req.query;

  const where: any = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (email) where.email = { [Op.iLike]: `%${email}%` };
  if (role) where.role = role;

  const result = await paginate(
    db.User,
    {
      where,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    },
    page as string,
    limit as string
  );

  res.json(result);
});

// ✅ Get User by ID (admin only)
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await db.User.findById(id).select("-password -__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user });
});

// ✅ Update User Role (admin only)
export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "donor", "reviewer"].includes(role)) {
      throw new ApiError(400, "Invalid role");
    }

    const user = await db.User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", user });
  }
);

// ✅ Delete User (admin only)
export const deleteUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await db.User.findById(id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // delete avatar from cloudinary if exists
    if (user.avatar) {
      await deleteFromCloudinary(user.avatar);
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  }
);
