export default class Exception extends Error {
  public readonly errorCode: number = 500;
  public readonly message: string = 'internal error';
}
