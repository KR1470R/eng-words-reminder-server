import InternalError from './internal-error';
import { HttpStatus } from '@nestjs/common';

export default class ForbiddenException extends InternalError {
  constructor(message = 'Forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
