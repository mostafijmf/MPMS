import Project from "../models/Project";
import { ExpressProps } from "../types";
import { errorResponse, successResponse } from "./responseController";

// <!-- Create Projects -->
export const createProjects: ExpressProps = async (req, res, next) => {
  try {
    const body = req.body;
    const result = await Project.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: `Project has been created successfully`,
      data: result
    });
  } catch (error) {
    next(error)
  }
};