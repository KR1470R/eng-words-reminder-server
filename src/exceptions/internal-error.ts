import { HttpException, HttpStatus } from '@nestjs/common';

export default class InternalError extends HttpException {
  constructor(
    message = 'Internal server error',
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
  }
}
