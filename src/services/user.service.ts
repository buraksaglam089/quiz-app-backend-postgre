import { PrismaClient, Prisma, User } from "@prisma/client";
import config from "config";
import { signJwt } from "../utils/jwt";

export const excludedFields = ["password", "verified", "verificationCode"];

const prisma = new PrismaClient();

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await prisma.user.create({
    data: input,
  })) as User;
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const signTokens = async (user: User) => {
  const access_token = signJwt({ sub: user.id }, "accessToken", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refresh_token = signJwt({ sub: user.id }, "refreshToken", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}d`,
  });

  return { refresh_token, access_token };
};
