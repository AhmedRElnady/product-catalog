class APIError extends Error {
    constructor (message, status) {
        super();

        Error.captureStackTrace(this, this.constructor);

        this.message = message || 'Something went wrong';

        this.stack = status || 400;
    }
}

module.exports = {
    APIError,
}