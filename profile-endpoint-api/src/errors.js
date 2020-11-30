class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error(message)).stack;
        }
    }
}

class NotFoundError extends ExtendableError {}
class JsonSchemaValidationError extends ExtendableError {}
class UnknownJsonSchemaError extends ExtendableError {}
class NoAppIdError extends ExtendableError {}

export {
    NotFoundError
    , JsonSchemaValidationError
    , UnknownJsonSchemaError
    , NoAppIdError
}