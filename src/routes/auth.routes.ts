import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser); // Regist a new user

router.post("/login", loginUser); // Login an existing user

router.post("/logout", logoutUser); // Logout an existing user

export default router;
