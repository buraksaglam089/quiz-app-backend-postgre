import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Request, Response, CookieOptions } from "express";
import { signJwt, verifyJwt } from "../utils/jwt";
import { signTokens } from "../services/user.service";
import bcrypt from "bcryptjs";
import config from "config";
import AppError from "../utils/appError";

const prisma = new PrismaClient();

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
};
const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username: username,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    },
  });
  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return next(new AppError(400, "User not found"));
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    return next(new AppError(400, "Invalid password"));
  }

  const { access_token, refresh_token } = await signTokens(user);
  res.cookie("access_token", access_token, accessTokenCookieOptions);
  res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
  res.cookie("logged_in", true, {
    ...accessTokenCookieOptions,
    httpOnly: false,
  });

  res.status(200).json({
    status: "success",
    access_token,
  });
};

export const logoutUser = (req: Request, res: Response) => {
  // Oturum çerezlerini temizle
  res.cookie("access_token", "", { ...accessTokenCookieOptions, maxAge: 0 });
  res.cookie("refresh_token", "", { ...refreshTokenCookieOptions, maxAge: 0 });
  res.cookie("logged_in", false, {
    ...accessTokenCookieOptions,
    httpOnly: false,
    maxAge: 0,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = "Could not refresh access token";

    if (!refresh_token) {
      return next(new AppError(403, message));
    }

    const decoded = verifyJwt<{ sub: number }>(refresh_token, "refreshToken");

    if (!decoded) {
      return next(new AppError(403, message));
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    if (!user) {
      return next(new AppError(403, message));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, "accessToken", {
      expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
    });

    // 4. Add Cookies
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // 5. Send response
    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
