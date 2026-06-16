export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;
  errorCode?: string;
  status: string;

  constructor(
    message: string,
    statusCode = 500,
    details?: any,
    errorCode?: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.details = details;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
