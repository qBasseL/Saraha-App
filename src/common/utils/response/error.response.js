import {NODE_ENV} from '../../../../config/config.service.js'

export const globalErrorHandler = (error, req, res, next) => {
  const status = error.cause?.status ?? 500;
  return res.status(status).json({
    status: status,
    Message: "Something Went Wrong",
    Error: error.message || 'Internal Server Error',
    extra: error.cause?.extra || null,
    stack: NODE_ENV === 'development' ? error.stack : undefined
  });
};

export const errorException = ({
  Message = "Fail",
  status = 400,
  extra = undefined,
} = {}) => {
  throw new Error(Message, { cause: { status: status, extra } });
};

export const notFoundException = ({
  Message = 'NotFound Exception',
  status = 404,
  extra = undefined
} = {}) => {
  return errorException({Message, status, extra})
}

export const forbiddenException = ({
  Message = 'Forbidden Exception',
  status = 403,
  extra = undefined
} = {}) => {
  return errorException({Message, status, extra})
}

export const conflictException = ({
  Message = 'Conflict Exception',
  status = 409,
  extra = undefined
} = {}) => {
  return errorException({Message, status, extra})
}

export const badRequestException = ({
  Message = 'Bad Request Exception',
  status = 400,
  extra = undefined
} = {}) => {
  return errorException({Message, status, extra})
}

export const unauthorizedException = ({
  Message = 'unauthorized Exception',
  status = 401,
  extra = undefined
} = {}) => {
  return errorException({Message, status, extra})
}