/**
 * @deprecated use HTTPException from hono/http-exception
 */
export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message?: string) {
    if (message) {
      super(`${status.toString()} - ${message}`);
    } else {
      super(status.toString());
    }

    this.status = status;
    this.name = 'HttpError';
  }

  public toString(): string {
    return `${this.status} - ${this.message}`;
  }
}
