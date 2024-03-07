import InternalError from './internal-error';
import { HttpStatus } from '@nestjs/common';

export default class NotFoundException extends InternalError {
  constructor(message = 'Not found') {
    super(message, HttpStatus.NOT_FOUND);
  }
}
