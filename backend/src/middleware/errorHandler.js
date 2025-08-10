const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // 默认错误状态码
  let statusCode = 500;
  let message = "Internal Server Error";

  // 根据错误类型设置状态码和消息
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (err.name === "ForbiddenError") {
    statusCode = 403;
    message = "Forbidden";
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
    message = "Not Found";
  } else if (err.name === "ConflictError") {
    statusCode = 409;
    message = err.message;
  }

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = { errorHandler };
