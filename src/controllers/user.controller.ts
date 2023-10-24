import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(prisma.user);
  await prisma.user.create({
    data: req.body,
  });

  res.status(201).json({
    status: "success",
    message: "An email with a verification code has been sent to your email",
  });
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
    include: {
      todos: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
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
    include: {
      todos: true,
    },
  });

  res.status(200).json({
    status: "success",
    data: users,
  });
};
