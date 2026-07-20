import express from "express";
const router = express.Router();

import * as authController from "../app/controllers/authController.js"
import authMiddleware from "../app/middlewares/authMiddleware.js";
import * as taskController from "../app/controllers/taskController.js"
import { authLimiter } from "../app/middlewares/rateLimiter.js";


// Public Routes
router.post("/register", authController.register)
router.post("/login", authLimiter, authController.login)
router.post("/verify-email", authLimiter, authController.verifyEmail)
router.post("/verify-otp", authLimiter, authController.verifyOTP)
router.post("/reset-password", authLimiter, authController.resetPassword)


// Protected Routes
router.get("/profile", authMiddleware, authController.getProfile)
router.put("/profile", authMiddleware, authController.updateProfile)
router.put("/change-password", authLimiter, authMiddleware, authController.changePassword)
router.delete("/account", authMiddleware, authController.deleteAccount)
router.post("/tasks", authMiddleware, taskController.createMyTask)
router.get("/tasks", authMiddleware, taskController.getMyTask)
router.put("/tasks/:id", authMiddleware, taskController.updateMyTask)
router.delete("/tasks/:id", authMiddleware, taskController.deleteMyTask)



export default router
