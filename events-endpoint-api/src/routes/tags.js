import express from "express";
import Tag from "../schemas/tagSchema.js";
import { ControllerErrorHandler } from "../errors.js";

const tagsRouter = express.Router();

tagsRouter.get("/", (req, res) => {
    Tag.find()
        .lean(true).exec()
        .then(tags => {
            if (!tags || tags == [])  throw new NotFoundError("Tags not found");

            res.json(tags).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});


tagsRouter.get('/:id', (req, res) => {
    Tag.find({
            id: req.params.id,
        }).lean(true).exec()
        .then(tags => {
            if (!tags || tags == [])  throw new NotFoundError("Tag not found");

            res.json(tags).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

export default tagsRouter;