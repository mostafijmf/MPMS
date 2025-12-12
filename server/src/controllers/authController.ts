import { compare } from "bcryptjs";
import User from "../models/User";
import { ExpressProps } from "../types";
import { errorResponse, successResponse } from "./responseController";
import { createJWT, verifyJWT } from "../libs/handleJWT";

const ONE_HOUR = 1000 * 60 * 60;
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

export const handleLogin: ExpressProps = async (req, res, next) => {
  try {
    const { email, password, isRemember: keep_login } = req.body;
    const user = await User.findOne({ email });

    if (!user) return errorResponse(res, {
      statusCode: 404,
      message: 'Incorrect email address.',
      inputError: {
        email: `Incorrect email address.`
      }
    });

    const passMatch = await compare(password, user.password);
    if (!passMatch) return errorResponse(res, {
      statusCode: 401,
      message: 'Incorrect password',
      inputError: {
        password: `Incorrect password`
      }
    });

    const expiredIn = keep_login ? ONE_WEEK : ONE_HOUR;

    const accessToken = await createJWT({
      type: "access",
      expiresIn: `1h`,
      payload: {
        _id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      }
    });

    const refreshToken = await createJWT({
      type: "refresh",
      expiresIn: `${expiredIn / 1000}sec`,
      payload: {
        _id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      }
    });

    res.cookie('accessToken', accessToken, {
      maxAge: ONE_HOUR,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: expiredIn,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return successResponse(res, {
      statusCode: 200,
      message: `User logged-in successfully`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogout: ExpressProps = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return successResponse(res, {
      statusCode: 200,
      message: `User logged-out successfully`,
    });
  } catch (error) {
    next(error);
  }
};

export const validateAuthToken: ExpressProps = async (req, res, next) => {
  try {
    // console.log("cookies: ",req.cookies);
    // console.log(req.headers.authorization);
    const token = req.cookies.refreshToken || req.headers.authorization?.split(" ,")[1].split("=")[1];
    // const accessToken = token![0].split("=")[1];
    // const refreshToken = token![1].split("=")[1];

    const decoded: any = await verifyJWT(token, "refresh");
    if (!decoded) return errorResponse(res, {
      statusCode: 401,
      message: 'Session timeout. Please login again',
    });

    const newAccessToken = await createJWT({
      type: "access",
      expiresIn: `1h`,
      payload: {
        _id: decoded?._id,
        role: decoded?.role,
        name: decoded?.name,
      }
    });

    res.cookie('accessToken', newAccessToken, {
      maxAge: ONE_HOUR,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated",
      data: {}
    });
  } catch (error) {
    next(error);
  }
};