import {
    NotFoundError
    , JsonSchemaValidationError
    , NoAppIdError
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

const getApplicationKey = (req, res, next) => {
    let application_key = req.headers['x-consumer-id'] || req.headers['application_id'];

    if (!application_key)
        throw new NoAppIdError("Can not id application neither 'application_id' or 'x-consumer-id' headers were provided.");

    req.moti = { application_key:  application_key };
    next();
}

const standardErrorsHandler = (err, req, res, next) => {
    switch (true) {
        case err instanceof NoAppIdError:
            res.status(400).json({"error": err.message}).end();
            break;
        default:
            throw err;
    }
    next();
}

export {
    bodyParserErrorHandler,
    handleControllerError,
    getApplicationKey,
    standardErrorsHandler
}