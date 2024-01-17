require("dotenv").config();

import express, { Response } from "express";
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user.routes";
import quizRouter from "./routes/quiz.routes";
import authRouter from "./routes/auth.routes";
import { requireUser } from "./middleware/requireUser";
import { deserializeUser } from "./middleware/deserializeUser";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

async function bootstrap() {
  // 1.Body Parser
  app.use(express.json({ limit: "10kb" }));

  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  // Testing
  app.get("/api/healthchecker", async (_, res: Response) => {
    res.status(200).json({
      status: "success",
      message: "Server is running",
    });
  });

  // ROUTES
  app.use("/api/users", userRouter);

  app.use("/api/quiz", quizRouter);

  app.use("/api/auth", authRouter);

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server on port: ${port}`);
  });
}

bootstrap()
  .catch((err) => {
    throw err;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
