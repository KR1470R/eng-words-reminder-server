import Exception from './exception';

export default class NotFoundException extends Exception {
  public readonly errorCode: number = 404;
  public readonly message: string = 'not found';
}
