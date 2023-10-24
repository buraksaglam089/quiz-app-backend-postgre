require("dotenv").config();
import express, { Response } from "express";
/* import validateEnv from './utils/validateEnv'; */
import { PrismaClient } from "@prisma/client";
import userRouter from "./routes/user.routes";
import toDoRouter from "./routes/todo.routes";
import cors from "cors";

/* validateEnv(); */

const prisma = new PrismaClient();
const app = express();

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
  app.use("/api/todos", toDoRouter);

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
