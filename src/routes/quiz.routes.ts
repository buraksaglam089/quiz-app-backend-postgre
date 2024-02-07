import express from "express";
import {
  createQuiz,
  getQuizById,
  addMultipleQuestions,
  updateQuestionById,
  deleteQuestionById,
  addAnswers,
  updateAnswerById,
  checkAnswer,
  checkAnswers,
  deleteAnswerById,
} from "../controllers/quiz.controller";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser); // Deserialize user from the request

// Quiz routes
router.post("/quizzes", createQuiz); // Create a new quiz
router.get("/quizzes/:quizId", getQuizById); // Get a quiz by ID

// Question routes
router.post("/quizzes/:quizId/questions", addMultipleQuestions); // Add multiple questions to a quiz
router.put("/questions/:questionId", updateQuestionById); // Update a specific question
router.delete("/questions/:questionId", deleteQuestionById); // Delete a specific question

// Answer routes
router.post("/questions/:questionId/answers", addAnswers); // Add answers to a question
router.put("/answers/:answerId", updateAnswerById); // Update a specific answer
router.delete("/answers/:answerId", deleteAnswerById); // Delete a specific answer

// Answer checking routes
router.post("/answers/check", checkAnswer); // Check a single answer
router.post("/answers/check-multiple", checkAnswers); // Check multiple answers

export default router;
