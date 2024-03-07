import InternalError from './internal-error';
import { HttpStatus } from '@nestjs/common';

export default class UnauthorizedException extends InternalError {
  constructor(message = 'Unauthorized') {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
