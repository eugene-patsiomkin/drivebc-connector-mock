import express from "express";
import { Validator } from "jsonschema";
import {handleControllerError} from '../app.js';
import {NotFoundError, JsonSchemaValidationError} from '../errors.js'
import Models from '../db.js'
import jsDraft7 from '../jsonschema-meta/draft-7.js'

const _v = new Validator();
const schemasRouter = express.Router();
const Schema = Models.Schema;

schemasRouter.get("/", (req, res) => {
    Schema.find(
            {
                application_key: req.moti.application_key
            }
        ).lean(true).exec()
        .then(schemas => {
            if (!schemas || schemas == [])  throw new NotFoundError("Schemas not found");

            res.json(schemas).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

schemasRouter.get('/:schema_name', (req, res) => {
    Schema.findOne(
        {
            name: req.params.schema_name,
            application_key: req.moti.application_key
        }
    ).lean(true).exec()
    .then(schemas => {
        if (!schemas || schemas == [])  throw new NotFoundError("Schema not found");

        res.json(schemas).status(200);
    })
    .catch((err) => handleControllerError(err, res));
});

schemasRouter.post('/', (req, res) => {
    let schObj = req.body;
    schObj.application_key = req.moti.application_key;
    let schemaContentObj = JSON.parse(schObj.jsonschema);
    let validationResult = _v.validate(schemaContentObj, jsDraft7) 
    validationResult.errors.forEach((e) => console.log(e));

    if (! validationResult.valid) throw new JsonSchemaValidationError("Schema field is not a draft 7 Json Schema");

    let schema = new Schema(schObj);
    schema.save()
        .then((schemas) => {
            res.json(schemas).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

schemasRouter.put("/:schema_name", (req, res) => {
    let updateSchema = (schema, newSchema) => {
        if (!schema) throw new NotFoundError("Schema not found");
        if (newSchema.jsonschema) {
            if (! _v.validate(
                JSON.parse(req.body.jsonschema)
                , jsDraft7).valid ) throw new JsonSchemaValidationError("Schema field is not a draft 7 Json Schema");
    
            schema.set("jsonschema", newSchema.jsonschema);
        }
        if (newSchema.description) schema.set("description", newSchema.description);
        return schema.save();
    }

    Schema.findOne(
        {
            name: req.params.schema_name,
            application_key: req.moti.application_key
        })
        .exec()
        .then((schema) => updateSchema(schema, req.body))
        .then(val => {
            res.status('200').json(val).end();
        })
        .catch((err) => handleControllerError(err, res));
});

schemasRouter.delete("/:schema_name", (req, res) => {
    let deleteSchema = (schema) => {
        if (!schema) throw new NotFoundError("Schema not found");

        return schema.remove();
    };

    Schema.findOne(
        {
            name: req.params.schema_name,
            application_key: req.moti.application_key
        })
        .exec()
        .then((schema) => deleteSchema(schema))
        .then(val => {
            res.status('200').json("Schema deleted").end();
        })
        .catch((err) => handleControllerError(err, res));
});

export default schemasRouter;