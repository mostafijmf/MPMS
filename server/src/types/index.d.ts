import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";


declare module 'express' {
  export interface Request {
    user?: any;
  }
}
export type ExpressProps = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// <!-- User -->
export interface IUser {
  _id?: string | ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "member";
  department: string;
  skills: string[];
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// <!-- Project -->
export interface IProject {
  _id?: string | ObjectId;
  title: string,
  client: string,
  description: string,
  startDate: Date,
  endDate: Date,
  budget: number,
  status: "planned" | "active" | "completed" | "archived";
  thumbnail: string,
  members: IUser;
}

// <!-- Sprint -->
export interface ISprint {
  _id?: string | ObjectId;
  title: string,
  sprintNumber: number,
  order: number
  project: IProject,
  startDate: Date,
  endDate: Date,
}

// <!-- Task -->
export interface ITask {
  _id?: string | ObjectId;
  project: IProject;
  sprint: ISprint;
  title: string;
  description: string;
  assignees: IUser[];
  estimateHours: number;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "review" | "done";
  dueDate: Date;
  attachments: IAttachment;
  subtasks: ISubtask;
  comments: IComment
}

export interface ISubtask {
  title: string;
  done: boolean;
}
export interface IAttachment {
  filename: string;
  url: string;
  size?: number;
}

// <!-- Comment -->
export interface IComment {
  _id?: string | ObjectId;
  author: IUser;
  task: ITask;
  body: string;
  parent: IComment | null;
}
