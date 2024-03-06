import Exception from './exception';

export default class UnauthorizedException extends Exception {
  public readonly errorCode: number = 401;
  public readonly message: string = 'unauthorized';
}
