import Exception from './exception';

export default class NotificationException extends Exception {
  public readonly errorCode: number = 200;
  public readonly message: string = 'ok';
}
