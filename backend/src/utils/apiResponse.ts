import { Response } from "express";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

interface ApiResponsePayload<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
  meta?: Meta;
}

// ─── Core Builder ─────────────────────────────────────────────────────────────

function buildResponse<T>(
  success: boolean,
  statusCode: number,
  message: string,
  data?: T,
  error?: string | Record<string, unknown>,
  meta?: Meta,
): ApiResponsePayload<T> {
  const payload: ApiResponsePayload<T> = { success, statusCode, message };

  if (data !== undefined) payload.data = data;
  if (error !== undefined) payload.error = error;
  if (meta !== undefined) payload.meta = meta;

  return payload;
}

// ─── ApiResponse Class ────────────────────────────────────────────────────────

export class ApiResponse {
  // 2xx — Success
  static ok<T>(res: Response, message: string, data?: T, meta?: Meta) {
    return res
      .status(200)
      .json(buildResponse(true, 200, message, data, undefined, meta));
  }

  static created<T>(res: Response, message: string, data?: T) {
    return res.status(201).json(buildResponse(true, 201, message, data));
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  // 4xx — Client Errors
  static badRequest(
    res: Response,
    message = "Bad Request",
    error?: string | Record<string, unknown>,
  ) {
    return res
      .status(400)
      .json(buildResponse(false, 400, message, undefined, error));
  }

  static unauthorized(res: Response, message = "Unauthorized") {
    return res
      .status(401)
      .json(buildResponse(false, 401, message, undefined, message));
  }

  static forbidden(res: Response, message = "Forbidden") {
    return res
      .status(403)
      .json(buildResponse(false, 403, message, undefined, message));
  }

  static notFound(res: Response, message = "Resource not found") {
    return res
      .status(404)
      .json(buildResponse(false, 404, message, undefined, message));
  }

  static conflict(
    res: Response,
    message = "Conflict",
    error?: string | Record<string, unknown>,
  ) {
    return res
      .status(409)
      .json(buildResponse(false, 409, message, undefined, error));
  }

  static unprocessable(
    res: Response,
    message = "Unprocessable Entity",
    error?: string | Record<string, unknown>,
  ) {
    return res
      .status(422)
      .json(buildResponse(false, 422, message, undefined, error));
  }

  static tooManyRequests(res: Response, message = "Too many requests") {
    return res
      .status(429)
      .json(buildResponse(false, 429, message, undefined, message));
  }

  // 5xx — Server Errors
  static internal(res: Response, message = "Internal Server Error") {
    return res
      .status(500)
      .json(buildResponse(false, 500, message, undefined, message));
  }

  // Generic — for dynamic status codes
  static send<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    error?: string | Record<string, unknown>,
    meta?: Meta,
  ) {
    const success = statusCode >= 200 && statusCode < 300;
    return res
      .status(statusCode)
      .json(buildResponse(success, statusCode, message, data, error, meta));
  }
}
