import express from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
  getMeHandler,
} from "../controllers/user.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.post("/", createUser);
router.get("/:id", getUserById);

router.use(deserializeUser, requireUser);

router.get("/me", getMeHandler);

router.get("/get/all", getAllUsers);

router.delete("/:id", deleteUserById);

router.put("/:id", updateUserById);

export default router;
