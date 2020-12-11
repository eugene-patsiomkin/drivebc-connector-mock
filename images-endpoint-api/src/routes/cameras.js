import express from "express";
import Camera from "../schemas/camerasSchema.js";
import { ControllerErrorHandler, NotFoundError } from "../errors.js";

const geoRouter = express.Router();

geoRouter.get("/", (req, res) => {
    Camera.find()
        .lean(true).exec()
        .then(cameras => {
            if (!cameras || cameras == [])  throw new NotFoundError("Cameras not found");

            res.json(cameras).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});


geoRouter.get('/:id', (req, res) => {
    Camera.findOne({"camera_id": req.params.id}).lean(true).exec()
        .then(camera => {
            if (!camera || camera == [])  throw new NotFoundError("Camera not found");

            res.json(camera).status(200);
        })
        .catch((err) => ControllerErrorHandler(err, res));
});

geoRouter.post('/', (req, res) => {
    let cameraDb = new Camera(req.body);

    cameraDb.save()
        .then(camera => {
            res.json(camera).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});


geoRouter.delete("/:id", (req, res) => {
    let deleteCamera = (camera) => {
        if (!camera) throw new NotFoundError("Camera not found");

        return camera.remove();
    };

    Camera.findById(req.params.id)
        .exec()
        .then((camera) => deleteCamera(camera))
        .then(() => {
            res.status('200').json("Camera deleted").end();
        })
        .catch((err) => handleControllerError(err, res));
});

export default geoRouter;