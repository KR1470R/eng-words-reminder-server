import Exception from './exception';

export default class MethodNotAllowedException extends Exception {
  public readonly errorCode: number = 405;
  public readonly message: string = 'not allowed';
}
