import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response, CookieOptions } from "express";
import { signJwt, verifyJwt } from "../utils/jwt";
import { signTokens } from "../services/user.service";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};
const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(Date.now() + 600 * 60 * 1000),
  maxAge: 600 * 60 * 1000,
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
  });
  res.status(201).json({
    status: "success",
    message: "An email with a verification code has been sent to your email",
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);

  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    return res.status(400).json({
      status: "fail",
      message: "Incorrect password",
    });
  }

  const { refresh_token } = await signTokens(user as User);

  res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);

  console.log("Oluşturulan refresh token: ", refresh_token);

  return res.status(200).json({
    status: "success",
    refresh_token,
  });
};
