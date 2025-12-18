import mongoose from "mongoose";
import Project from "../models/Project";
import { ExpressProps } from "../types";
import { errorResponse, successResponse } from "./responseController";
import { removeMediaFromCloudinary, uploadMediaToCloudinary } from "../libs/cloudinary-media-handler";
import Task from "../models/Task";

// <!-- Create Projects -->
export const createProjects: ExpressProps = async (req, res, next) => {
  try {
    const body = req.body;

    const thumbnail = req.file ?
      (await uploadMediaToCloudinary(req.file)).secure_url
      : "";

    const result = await Project.create({
      ...body,
      thumbnail,
      userId: req?.user?._id
    });

    return successResponse(res, {
      statusCode: 201,
      message: `Project has been created successfully`,
      data: result
    });
  } catch (error) {
    next(error)
  }
};

// <!-- Get All Projects -->
export const getAllProjects: ExpressProps = async (req, res, next) => {
  try {
    const user = req.user;
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status || '';

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter: any = {
      $or: [
        { title: { $regex: searchRegExp } },
        { client: { $regex: searchRegExp } },
      ]
    };

    if (status) filter.status = status;

    if (user?.role === "member") {
      const projectIds = await Task.distinct("projectId", {
        assigns: user._id
      });
      filter._id = { $in: projectIds };
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await Project.countDocuments(filter);

    return successResponse(res, {
      statusCode: 200,
      message: `Projects were returned successfully`,
      data: {
        projects: projects,
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

// <!-- Get Project By ID -->
export const getProjectById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;

    const project = await Project.findById(id)

    if (!project) return errorResponse(res, { statusCode: 404, message: "Project does not exist" })

    return successResponse(res, {
      statusCode: 200,
      message: `Project was returned successfully`,
      data: project
    });
  } catch (error) {
    next(error)
  }
};

// <!-- Update Project By Id -->
export const updateProjectById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;

    const project = await Project.findById(id);
    if (!project) return errorResponse(res, { statusCode: 404, message: "Project does not exist" })

    const body = { ...req.body };

    // <!-- Handle Thumbnail -->
    if (req.file) {
      body.thumbnail = (await uploadMediaToCloudinary(req.file)).secure_url
      if (project?.thumbnail) await removeMediaFromCloudinary(project.thumbnail);
    };

    const result = await Project.findByIdAndUpdate(id, body)

    return successResponse(res, {
      statusCode: 200,
      message: `Project was updated successfully`,
      data: result
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid project id' });
    };
    next(error);
  }
};

// <!-- Delete Project By Id -->
export const deleteProjectById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;

    await Project.findByIdAndDelete(id);

    return successResponse(res, {
      statusCode: 200,
      message: `Project was deleted successfully`,
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid project id' });
    };
    next(error);
  }
};