import { validationResult } from "express-validator";
import { ExpressProps } from "../types";
import { errorResponse } from "../controllers/responseController";

export const runValidation: ExpressProps = async (req, res, next) => {
  try {
    // console.log("Validator body: ", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, {
        statusCode: 422,
        message: errors.array()[0].msg
      });
    }
    return next();
  } catch (error) {
    return next();
  }
};