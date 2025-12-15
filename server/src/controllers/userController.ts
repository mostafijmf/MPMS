import mongoose from "mongoose";
import User from "../models/User";
import { ExpressProps } from "../types";
import { errorResponse, successResponse } from "./responseController";
import { removeMediaFromCloudinary, uploadMediaToCloudinary } from "../libs/cloudinary-media-handler";

// <!-- Create User -->
export const createUser: ExpressProps = async (req, res, next) => {
  try {
    const body = req.body;

    const isEmailExist = await User.findOne({ email: body.email });
    if (isEmailExist) return errorResponse(res, {
      statusCode: 409,
      message: 'This email already taken!',
      inputError: {
        email: `This email already taken!`
      }
    });

    const avatar = req.file ?
      (await uploadMediaToCloudinary(req.file)).secure_url
      : "";

    await User.create({ ...body, avatar });

    return successResponse(res, {
      statusCode: 201,
      message: `User has been created successfully`,
    });
  } catch (error) {
    next(error)
  }
};

// <!-- Get all Users -->
export const getAllUsers: ExpressProps = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const role = req.query.role?.toString().toLowerCase() || '';

    const searchRegExp = new RegExp('.*' + search + '.*', 'i');
    const filter: any = {
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
      ]
    };
    if (role) filter.role = role;

    const users = await User.find(filter, { password: 0 })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    return successResponse(res, {
      statusCode: 200,
      message: 'Users were returned',
      data: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// <!-- Update User By ID -->
export const updateUserById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;

    // if (req?.user?._id !== id)
    //   return errorResponse(res, { statusCode: 403, message: "Unauthorized user can't proceed" });

    const user = await User.findById(id, { password: 0 });
    if (!user)
      return errorResponse(res, { statusCode: 404, message: 'User does not exist' });

    const body = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, body);

    return successResponse(res, {
      statusCode: 200,
      message: 'User was updated successfully',
      data: updatedUser,
    });

  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid user id' });
    };
    next(error);
  }
};

// <!-- Delete User By ID -->
export const deleteUserById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) return errorResponse(res, { statusCode: 404, message: 'User does not exist' });
    if (user?.avatar) await removeMediaFromCloudinary(user.avatar);
    await User.findByIdAndDelete(id);

    return successResponse(res, {
      statusCode: 200,
      message: 'User was deleted successfully',
    });

  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid user id' });
    };
    next(error);
  }
};

// <!-- Get User By ID -->
export const getUserById: ExpressProps = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id, { password: 0 });
    if (!user) return errorResponse(res, { statusCode: 404, message: 'User does not exist' });

    return successResponse(res, {
      statusCode: 200,
      message: 'User was returned successfully',
      data: user,
    });

  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid user id' });
    };
    next(error);
  }
};

// <!-- Get User By Access Token -->
export const getUserProfileByToken: ExpressProps = async (req, res, next) => {
  try {
    const id = (await req?.user)?._id;
    const user = await User.findById(id, { password: 0 });
    if (!user) return errorResponse(res, { statusCode: 404, message: 'User does not exist' });

    return successResponse(res, {
      statusCode: 200,
      message: 'User was returned successfully',
      data: user,
    });

  } catch (error) {
    if (error instanceof mongoose.Error) {
      return errorResponse(res, { statusCode: 400, message: 'Invalid user id' });
    };
    next(error);
  }
};
