import { body } from "express-validator";

export const validateLoginData = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];