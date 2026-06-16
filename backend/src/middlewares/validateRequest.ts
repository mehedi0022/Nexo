import type { RequestHandler } from "express";
import type { AnyObjectSchema } from "yup";

import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface ValidationSchemas {
  body?: AnyObjectSchema;
  query?: AnyObjectSchema;
  params?: AnyObjectSchema;
}

export const validateRequest = (schemas: ValidationSchemas): RequestHandler => {
  return asyncHandler(async (req, _res, next) => {
    if (schemas.body) {
      req.body = await schemas.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    }

    if (schemas.query) {
      req.query = await schemas.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
    }

    if (schemas.params) {
      req.params = await schemas.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });
    }

    next();
  });
};
