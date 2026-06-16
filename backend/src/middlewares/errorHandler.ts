import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import { Prisma } from "../generated/prisma/client.js";
import { ValidationError } from "yup";

import { ApiResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";

const isProduction = process.env.NODE_ENV === "production";

export const notFoundHandler: RequestHandler = (req, res) => {
  ApiResponse.notFound(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
  );
};

const formatPrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  switch (err.code) {
    case "P2002":
      return {
        statusCode: 409,
        message: `Duplicate value for: ${(err.meta?.target as string[])?.join(", ") || "unique field"}`,
      };

    case "P2025":
      return {
        statusCode: 404,
        message: "Requested record not found",
      };

    case "P2003":
      return {
        statusCode: 400,
        message: "Invalid relation. Related record does not exist",
      };

    case "P2000":
      return {
        statusCode: 400,
        message: "Input value is too long",
      };

    case "P2014":
      return {
        statusCode: 400,
        message: "Invalid relation data",
      };

    default:
      return {
        statusCode: 500,
        message: "Database operation failed",
      };
  }
};

const formatMulterError = (err: multer.MulterError) => {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return "File size is too large";
    case "LIMIT_FILE_COUNT":
      return "Too many files uploaded";
    case "LIMIT_UNEXPECTED_FILE":
      return `Unexpected file field: ${err.field || "unknown"}`;
    case "LIMIT_FIELD_COUNT":
      return "Too many fields uploaded";
    case "LIMIT_FIELD_KEY":
      return "Field name is too long";
    case "LIMIT_FIELD_VALUE":
      return "Field value is too long";
    case "LIMIT_PART_COUNT":
      return "Too many parts in form data";
    default:
      return "File upload failed";
  }
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = "Internal Server Error";
  let details: unknown = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = formatPrismaError(err);
    statusCode = prismaError.statusCode;
    message = prismaError.message;

    if (!isProduction) {
      details = {
        code: err.code,
        meta: err.meta,
      };
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid database query data";

    if (!isProduction) {
      details = err.message;
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = "Database connection failed";

    if (!isProduction) {
      details = err.message;
    }
  } else if (err instanceof multer.MulterError) {
    statusCode = 400;
    message = formatMulterError(err);

    if (!isProduction) {
      details = {
        code: err.code,
        field: err.field,
      };
    }
  } else if (err instanceof ValidationError) {
    statusCode = 422;
    message = "Validation failed";

    details = err.inner.length
      ? err.inner.map((issue) => ({
          path: issue.path,
          message: issue.message,
        }))
      : [
          {
            path: err.path,
            message: err.message,
          },
        ];
  } else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON body";
  } else if (err instanceof Error) {
    message = isProduction ? "Internal Server Error" : err.message;
  }

  console.error({
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    error: err,
  });

  ApiResponse.send(
    res,
    statusCode,
    message,
    details,
    isProduction ? undefined : err instanceof Error ? err.stack : err,
  );
};
