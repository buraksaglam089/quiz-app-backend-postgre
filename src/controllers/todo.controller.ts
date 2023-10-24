import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();
// userId'ye göre güncelle
// userları çekerken altında o usera ait todoları getir nasıl yapabileceğini bul include keyword bu iş için
export const createToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, userId } = req.body; // To-Do başlığı, açıklama ve kullanıcı kimliğini (userId) alma

    // Kullanıcının kimliği (userId) ile ilgili işlemleri gerçekleştirin

    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json({
      status: "success",
      data: newTodo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

export const getToDoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findMany({
      where: {
        id: Number(id),
        userId: req.body.userId,
      },
    });

    if (!todo) {
      res.status(404).json({
        status: "error",
        message: "To-Do not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
export const getAllToDos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await prisma.todo.findMany();

    if (!todo) {
      res.status(404).json({
        status: "error",
        message: "There is no To-Do",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
export const deleteToDo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  try {
    const result = await prisma.todo.delete({
      where: {
        id: Number(id),
      },
    });
    if (!result) {
      res.status(404).json({
        status: "error",
        message: "To-Do not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "To-Do deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
export const updateToDoById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedToDo = await prisma.todo.update({
      where: {
        id: Number(id),
      },
      data: updatedData,
    });

    if (!updatedToDo) {
      res.status(404).json({
        status: "error",
        message: "To-Do not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: updatedToDo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
