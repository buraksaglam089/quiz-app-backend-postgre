import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const createQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, userId, duration, thumbnailUrl, dueDate, quizType, quizTime } =
    req.body;

  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        userId,
        duration,
        thumbnailUrl,
        dueDate,
        quizType,
        quizTime,
      },
    });
    res.status(201).json({ status: "success", message: "Quiz created", quiz });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const getQuizById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
      include: {
        questions: {
          include: {
            answer: true, // Include answers for each question
          },
        },
        user: true, // Include the user associated with the quiz
      },
    });
    if (!quiz) {
      return res
        .status(404)
        .json({ status: "error", message: "Quiz not found" });
    }
    res.status(200).json({ status: "success", message: "Quiz found", quiz });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const addMultipleQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { quizId, questions } = req.body; // `questions` should be an array of question objects

  try {
    const quiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        questions: {
          create: questions.map((question: any) => ({
            text: question.text,
            imageUrl: question.imageUrl,
            options: JSON.stringify(question.options), // Ensure options are stringified
          })),
        },
      },
    });

    //burda güvenlik açığı olabilir .lenght checki yapılabilir

    res.status(201).json({
      status: "success",
      message: "Questions added successfully",
      quiz,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionId } = req.params;
  const { text, imageUrl, options } = req.body;

  try {
    const question = await prisma.question.update({
      where: { id: Number(questionId) },
      data: {
        text,
        imageUrl,
        options: options,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Question updated successfully",
      question,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionId } = req.params;

  try {
    await prisma.question.delete({
      where: { id: Number(questionId) },
    });
    res.status(201).json({
      status: "success",
      message: "Question deleted successfully",
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const addAnswers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionId, text } = req.body; // Assuming the request body contains the question ID and the answer text

  try {
    const answer = await prisma.answer.create({
      data: {
        text: text,
        questionId: Number(questionId),
      },
    });
    res.status(201).json({
      status: "success",
      message: "Answer added successfully",
      answer,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const updateAnswerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { answerId } = req.params;
  const { text } = req.body;

  try {
    const answer = await prisma.answer.update({
      where: { id: Number(answerId) },
      data: { text },
    });
    if (!answer) {
      return res
        .status(404)
        .json({ status: "error", message: "Answer not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Answer updated successfully",
      answer,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const checkAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { questionId } = req.params; // ID of the answer to be checked
  const { userAnswer } = req.body; // User's answer text

  try {
    // Retrieve the correct answer from the database
    const correctAnswer = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      select: {
        answer: {
          select: { text: true },
        },
      },
    });

    // Check if the user's answer matches the correct answer
    const isCorrect =
      correctAnswer && correctAnswer.answer?.text === userAnswer;

    res.status(200).json({
      status: "success",
      message: `Your answer is ${isCorrect ? "correct" : "incorrect"}.`,
      isCorrect,
      answer: correctAnswer ? correctAnswer.answer?.text : null,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const checkAnswers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userResponses = req.body; // Expecting an array of { questionId, userResponse }

  try {
    // Iterate over user responses to validate each one
    const results = await Promise.all(
      userResponses.map(
        async (response: { questionId: number; userResponse: string }) => {
          const correctAnswer = await prisma.answer.findFirst({
            where: { questionId: Number(response.questionId) },
          });

          const isCorrect =
            correctAnswer && correctAnswer.text === response.userResponse;

          return {
            questionId: response.questionId,
            userResponse: response.userResponse,
            isCorrect,
            correctAnswer: correctAnswer ? correctAnswer.text : null,
          };
        }
      )
    );

    res.status(200).json({
      status: "success",
      message: "Answers checked",
      results,
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const deleteAnswerById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { answerId } = req.params;

  try {
    await prisma.answer.delete({
      where: { id: Number(answerId) },
    });
    res.status(201).json({
      status: "success",
      message: "Answer deleted successfully",
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Diğer fonksiyonlar aynı kalabilir, ya da ihtiyaca göre düzenlenebilir.
// refresh_token ve auth
