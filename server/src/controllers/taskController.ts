import mongoose from "mongoose";
import { removeMediaFromCloudinary, uploadMediaToCloudinary } from "../libs/cloudinary-media-handler";
import Task from "../models/Task";
import { ExpressProps } from "../types";
import { errorResponse, successResponse } from "./responseController";

// <!-- Add Task By Project & Sprint IDs -->
export const addTaskByProjectSprintIds: ExpressProps = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;

    const attachments = req.file ?
      (await uploadMediaToCloudinary(req.file)).secure_url
      : "";

    const body = { ...req.body, projectId, sprintId };

    if (attachments) body.attachments = {
      filename: req.file?.originalname,
      url: attachments,
      size: req.file?.size
    }

    const result = await Task.create(body);

    return successResponse(res, {
      statusCode: 201,
      message: `Task has been added successfully`,
      data: result
    });
  } catch (error) {
    next(error)
  }
};

// <!-- Update Task By Id -->
export const updateTaskById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.taskId;

    const task = await Task.findById(id);
    if (!task) return errorResponse(res, { statusCode: 404, message: "Task does not exist" })

    const body = { ...req.body };

    // <!-- Handle Attachments -->
    if (req.file) {
      const attachments = (await uploadMediaToCloudinary(req.file)).secure_url;
      body.attachments = [{
        filename: req.file?.originalname,
        url: attachments,
        size: req.file?.size
      }];
      if (task?.attachments && task?.attachments?.length > 0) {
        await Promise.all(
          task?.attachments?.map((file: any) => removeMediaFromCloudinary(file?.url))
        );
      }
    };

    const result = await Task.findByIdAndUpdate(id, body, { new: true });

    return successResponse(res, {
      statusCode: 200,
      message: `Task has been updated successfully`,
      data: result
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid task id' });
    };
    next(error)
  }
};

// <!-- Update Task Status By Id -->
export const updateTaskStatusById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.taskId;
    const status = req.body.status;

    const task = await Task.findById(id);
    if (!task) return errorResponse(res, { statusCode: 404, message: "Task does not exist" })
    if (!status) return errorResponse(res, { statusCode: 400, message: "Status is required" })

    const result = await Task.findByIdAndUpdate(id, { status });

    return successResponse(res, {
      statusCode: 200,
      message: `Task status updated successfully`,
      data: result
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid task id' });
    };
    next(error)
  }
};

// <!-- Get Tasks By Project & Sprint IDs -->
export const getTaskByProjectSprintIds: ExpressProps = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const sprintId = req.params.sprintId;
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter: any = { projectId, sprintId };
    if (search) filter.title = { $regex: searchRegExp }

    const sprints = await Task.find(filter)
      .populate("assigns", "_id name email avatar role department skills createdAt")
      // .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Task.countDocuments(filter);

    return successResponse(res, {
      statusCode: 200,
      message: `Tasks were returned successfully`,
      data: {
        tasks: sprints,
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

// <!-- Delete Task By Id -->
export const deleteTaskById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await Task.findById(id);
    if (!task) return errorResponse(res, { statusCode: 404, message: "Task does not exist" })

    if (task?.attachments && task?.attachments?.length > 0)
      task?.attachments?.map(async (file: any) =>
        await removeMediaFromCloudinary(file?.url)
      );

    await Task.findByIdAndDelete(id)

    return successResponse(res, {
      statusCode: 200,
      message: `Task has been deleted successfully`,
      data: null
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid task id' });
    };
    next(error)
  }
};
