import { errorResponse } from "../controllers/responseController";
import { verifyJWT } from "../libs/handleJWT";
import { ExpressProps } from "../types";

export const isLoggedIn: ExpressProps = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.headers.authorization?.split("=")[1];

    if (!token || token === "undefined") return errorResponse(res, {
      statusCode: 401,
      message: 'Unauthorized access. Please login again',
    });

    const decoded = await verifyJWT(token, 'access');
    if (!decoded) return errorResponse(res, {
      statusCode: 401,
      message: 'Invalid access token. Please login again',
    });

    req.user = decoded;
    next();
  } catch (error) {
    return next(error);
  }
};

export const isOnlyAdmin: ExpressProps = async (req, res, next) => {
  try {
    const user = await req.user;
    if (user.role !== "admin") return errorResponse(res, {
      statusCode: 403,
      message: "You do not have permission to access this route.",
    });

    next();
  } catch (error) {
    return next(error);
  }
}

export const isAdmins: ExpressProps = async (req, res, next) => {
  try {
    const user = await req.user;
    if (!(user.role === "admin" || user.role === "manager")) return errorResponse(res, {
      statusCode: 403,
      message: "You do not have permission to access this route.",
    });

    next();
  } catch (error) {
    return next(error);
  }
}