import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { BASE_URL } from "./libs/secret";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRouter";
import { errorResponse } from "./controllers/responseController";
import authRouter from "./routers/authRouter";
import projectsRouter from "./routers/projectsRouter";

const app: Application = express();

// <!-- Middlewares -->
app.use(cors({ origin: BASE_URL, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static('public'));

// <!-- Routes -->
app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/projects", projectsRouter);


// <!-- Invalid route -->
app.all("{*splat}", (req, res) => {
  res.send('Requested resource not found!')
});


// <!-- Global Error Handling Middleware -->
app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  // <!-- Media file size error -->
  if (err.code === "LIMIT_FILE_SIZE") {
    return errorResponse(res, {
      statusCode: 400,
      message: "File too large (max size: image 1MB, video 2MB)",
    });
  }

  // <!-- MongoDB Duplicate field error -->
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return errorResponse(res, {
      statusCode: 400,
      message: `Duplicate field value: ${field} already exists. Please use another value!`,
    });
  }

  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

export default app;
