import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.post("/register", registerUser); // Regist a new user

router.post("/login", loginUser); // Login an existing user

router.use(deserializeUser, requireUser); // Deserialize user from the request

router.post("/logout", logoutUser); // Logout an existing user

export default router;
