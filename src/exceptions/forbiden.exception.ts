import Exception from './exception';

export default class ForbiddenException extends Exception {
  public readonly errorCode: number = 403;
  public readonly message: string = 'forbidden';
}
