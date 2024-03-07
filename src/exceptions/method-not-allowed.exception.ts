import InternalError from './internal-error';
import { HttpStatus } from '@nestjs/common';

export default class MethodNotAllowedException extends InternalError {
  constructor(message = 'Not allowed') {
    super(message, HttpStatus.METHOD_NOT_ALLOWED);
  }
}
