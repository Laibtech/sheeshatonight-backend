import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse.message || 'Operation failed';

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message[0] : message,
      error:
        typeof exceptionResponse === 'object' && exceptionResponse.error
          ? exceptionResponse.error
          : status === 500
          ? 'INTERNAL_SERVER_ERROR'
          : 'BAD_REQUEST',
    });
  }
}
