import express from "express";
import Geofence from "../schemas/geofenceSchema.js";
import { ControllerErrorHandler } from "../errors.js";

const geoRouter = express.Router();

geoRouter.get("/", (req, res) => {
    Geofence.find()
        .lean(true).exec()
        .then(geofence => {
            if (!geofence || geofence == [])  throw new NotFoundError("Geofences not found");

            res.json(geofence).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});


geoRouter.get('/:id', (req, res) => {
    Geofence.find({
            id: req.params.id,
        }).lean(true).exec()
        .then(geofence => {
            if (!geofence || geofence == [])  throw new NotFoundError("Geofence not found");

            res.json(geofence).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

export default geoRouter;