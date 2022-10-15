import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { body } from 'express-validator'
import { validationResultExpress } from "../middlewares/validationResultExpress.js";
const router = express.Router()

router.post(
  '/register', 
  [
    body('email', "Invalid email format")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body('password', "Invalid password format")
      .trim()
      .isLength({ min: 8 })
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
            throw new Error("Both passwords must coincide");
        }
        return value;
      }),
  ],
  validationResultExpress,
  register)
router.post(
  '/login',
  [
    body('email', "Invalid email format")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body('password', "Invalid password format")
      .trim()
      .isLength({ min: 8 })
  ],
  validationResultExpress,
  login)

export default router;