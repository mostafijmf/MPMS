"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProjectData = void 0;
const express_validator_1 = require("express-validator");
exports.validateProjectData = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),
    (0, express_validator_1.body)('client')
        .trim()
        .notEmpty()
        .withMessage('Client is required'),
    (0, express_validator_1.body)('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    (0, express_validator_1.body)('startDate')
        .trim()
        .notEmpty()
        .withMessage('Start date is required'),
    (0, express_validator_1.body)('endDate')
        .trim()
        .notEmpty()
        .withMessage('End date is required'),
    (0, express_validator_1.body)('budget')
        .notEmpty()
        .withMessage('Budget is required'),
];
