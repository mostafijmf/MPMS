"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginData = void 0;
const express_validator_1 = require("express-validator");
exports.validateLoginData = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required'),
    (0, express_validator_1.body)('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
];
