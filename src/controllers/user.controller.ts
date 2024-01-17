import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
  res.status(201).json({
    status: "success",
    message: "An email with a verification code has been sent to your email",
  });
};
export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  if (id === undefined) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid id",
    });
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        gte: 1, // 'gte' 'greater than or equal to' (büyük veya eşit) anlamına gelir
      },
    },
  });

  res.status(200).json({
    status: "success",
    data: users,
  });
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  await prisma.user.delete({
    where: {
      id: Number(id),
    },
  });

  res.status(204).json({
    status: "success",
    message: "User deleted successfully",
  });
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: Number(id),
    },
    data: {
      ...req.body,
    },
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
};
