import mongoose from "mongoose";
import Sprint from "../models/Sprint";
import { ExpressProps } from "../types";
import { errorResponse, successResponse } from "./responseController";
import Task from "../models/Task";

// <!-- Add Sprint By Project ID -->
export const addSprintByProjectId: ExpressProps = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const body = req.body;

    const result = await Sprint.create({
      ...body,
      projectId: projectId,
      userId: req.user?._id
    });

    return successResponse(res, {
      statusCode: 201,
      message: `Sprint has been added successfully`,
      data: result
    });
  } catch (error) {
    next(error)
  }
};

// <!-- Get Sprints By Project ID -->
export const getSprintsByProjectId: ExpressProps = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter: any = { projectId: projectId, };
    if (search) filter.title = { $regex: searchRegExp }

    const sprints = await Sprint.find(filter)
      .sort({ sprintNumber: 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Sprint.countDocuments(filter);

    return successResponse(res, {
      statusCode: 200,
      message: `Sprints were returned successfully`,
      data: {
        sprints: sprints,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        },
      }
    });
  } catch (error) {
    next(error)
  }
};

// <!-- Get Sprint By ID -->
export const getSprintById: ExpressProps = async (req, res, next) => {
  try {
    const sprintId = req.params.sprintId;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return errorResponse(res, { statusCode: 404, message: "Sprint does not exist" })

    return successResponse(res, {
      statusCode: 200,
      message: `Sprint was returned successfully`,
      data: sprint
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid sprint id' });
    };
    next(error)
  }
};

// <!-- Update Sprint By ID -->
export const updateSprintById: ExpressProps = async (req, res, next) => {
  try {
    const sprintId = req.params.sprintId;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return errorResponse(res, { statusCode: 404, message: "Sprint does not exist" });

    const result = await Sprint.findByIdAndUpdate(sprintId, req.body);

    return successResponse(res, {
      statusCode: 200,
      message: `Sprint has been updated successfully`,
      data: result
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid sprint id' });
    };
    next(error)
  }
};

// <!-- Delete Sprint By ID -->
export const deleteSprintById: ExpressProps = async (req, res, next) => {
  try {
    const sprintId = req.params.sprintId;

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return errorResponse(res, { statusCode: 404, message: "Sprint does not exist" });

    await Task.deleteMany({ sprintId });
    await Sprint.findByIdAndDelete(sprintId)

    return successResponse(res, {
      statusCode: 200,
      message: `Sprint was deleted successfully`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid sprint id' });
    };
    next(error)
  }
};