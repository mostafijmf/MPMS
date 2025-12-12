import { body } from "express-validator";

export const validateProjectData = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
  body('client')
    .trim()
    .notEmpty()
    .withMessage('Client is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('startDate')
    .trim()
    .notEmpty()
    .withMessage('Start date is required'),
  body('endDate')
    .trim()
    .notEmpty()
    .withMessage('End date is required'),
  body('budget')
    .notEmpty()
    .withMessage('Budget is required'),
];