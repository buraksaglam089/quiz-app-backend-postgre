import express from "express";
import {
  createUser,
  getUserById,
  getAllUsers,
  deleteUserById,
  updateUserById,
} from "../controllers/user.controller";

const router = express.Router();

router.post("/", createUser);

router.get("/:id", getUserById);

router.get("/get/all", getAllUsers);

router.delete("/:id", deleteUserById);

router.put("/:id", updateUserById);

export default router;
