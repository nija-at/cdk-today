/**
 * Class that represents error either from user input or configuration.
 */
export class UserError extends Error {
  public static readonly NAME: string = 'UserError';

  public constructor(message: string) {
    super(message);
    this.name = 'UserError';
    Error.captureStackTrace(this, this.constructor);
  }
}