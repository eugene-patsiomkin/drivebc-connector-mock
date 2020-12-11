import {
    NotFoundError
    , JsonSchemaValidationError
} from './errors.js'

const bodyParserErrorHandler = (error, req, res, next) => {
    switch (true) {
        case (error instanceof SyntaxError) && error.message.includes('JSON'):
            res.status(400).end("Invalid JSON provided");
            break;

        default:
            next();
    }
};

const handleControllerError = (err, res) => {
    console.info(err.name);
    switch (true) {
        case err instanceof NotFoundError:
            res.status(404).send(err.message).end();
            break;
        case err.name == 'ValidationError':
            res.status(400).send(err).end();
            break;
        case err.name == 'MongoError':
            res.status(400).send(err).end();
            break;
        case err instanceof JsonSchemaValidationError:
            res.status(400).send({error: {name: err.name, message: err.message, errors: err.errors}}).end();
            break;
        default:
            console.error(err);
            res.status(500).send(err).end();
    }
}

export {
    bodyParserErrorHandler,
    handleControllerError
}