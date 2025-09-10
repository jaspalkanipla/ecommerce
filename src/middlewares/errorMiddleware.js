import { errorResponse } from "../utils/responseHandler.js";

export const notFound = (req, res, next) => {
  return errorResponse(res, `Not Found - ${req.originalUrl}`, 404);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return errorResponse(res, err.message || "Server Error", statusCode, err.stack);
};
