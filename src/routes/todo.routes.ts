import express from "express";
import {
  createToDo,
  getToDoById,
  getAllToDos,
  deleteToDo,
  updateToDoById,
} from "../controllers/todo.controller";

const router = express.Router();

router.post("/", createToDo);

router.get("/:id", getToDoById);

router.get("/", getAllToDos);

router.delete("/:id", deleteToDo);

router.put("/:id", updateToDoById);

export default router;
