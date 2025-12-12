import { Response } from "express";

type ErrorProps = {
  statusCode?: number;
  message?: string;
  [key: string]: any;
};

export const errorResponse = (res: Response, {
  statusCode = 500,
  message = 'Internal Server Error',
  ...others
}: ErrorProps) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
    ...others
  });
};

type SuccessProps = {
  statusCode?: number;
  message?: string;
  data?: any;
};

export const successResponse = (res: Response, {
  statusCode = 200,
  message = 'Internal Server Error',
  data = {}
}: SuccessProps) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data
  });
};