class ValidationError extends Error {
    constructor(statusCode, message) {
      super();
  
      this.name = 'ValidationError';
      this.status = statusCode;
      this.message = message;
    }
  
    BadRequest(ErrObj, fieldExistsIn = 'body') {
      return new ValidationError(400, { [fieldExistsIn]: [ErrObj] });
    }
  
    UnprocessableEntity(ErrObj, fieldExistsIn = 'body') {
      return new ValidationError(422, { [fieldExistsIn]: [ErrObj] });
    }
  } // end Class
  
  module.exports = ValidationError;