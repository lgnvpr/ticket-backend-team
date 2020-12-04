export class AleError extends Error {
    constructor(message: any, public readonly status: number) {
      super(message);
    }
  
    static alreadyExists(message: any): AleError {
      return new AleError(message, 430);
    }
    static notFound(message: any): AleError {
      return new AleError(message, 404);
    }
  
    static badInput(message: any): AleError {
      return new AleError(message, 400);
    }
  
    static conflict(message: any): AleError {
      return new AleError(message, 409);
    }
  
    static unexpected(message: any): AleError {
      return new AleError(message, 500);
    }
  
    static unauthenticated(): AleError {
      return new AleError('Not Authenticated', 401);
    }
  
    static unauthorized(message: any = 'Unauthorized'): AleError {
      return new AleError(message, 403);
    }

    static oneTimeAction(message: any): AleError {
      return new AleError(message, 405);
    }
}
