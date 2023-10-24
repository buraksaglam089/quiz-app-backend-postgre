import express from "express";
import { createUser, getUserById } from "../controllers/user.controller";

const router = express.Router();

router.post("/", createUser);

router.get("/:id", getUserById);



export default router;
