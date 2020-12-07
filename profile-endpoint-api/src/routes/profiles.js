import express from "express";
import { Validator } from "jsonschema";
import _merge from "lodash/merge.js"

import {handleControllerError} from '../app.js';
import {NotFoundError, JsonSchemaValidationError} from '../errors.js'
import Models from '../db.js'

const _v = new Validator();
const profileRouter = express.Router();
const Profile = Models.Profile;
const Schema = Models.Schema;

const validateProfile = (profile) => {
    return new Promise((resolve, reject) => {
        if (!profile.profile) throw new JsonSchemaValidationError("Profile is empty");

        Schema.findOne({
            name: profile.validation_schema_name,
            application_key: profile.application_key
        }).lean(true).exec()
        .then(schema => {
            if (!schema || schema == [])  throw new NotFoundError("Schema not found");
            if (! _v.validate(
                JSON.parse(profile.profile)
                , JSON.parse(schema.jsonschema)
            ).valid) throw new JsonSchemaValidationError("Profile field is not a draft 7 Json Profile");

            resolve(profile);
        })
        .catch((err) => reject(err));;
    }); 
};

profileRouter.get("/", (req, res) => {
    Profile.find({
            application_key: req.moti.application_key
        })
        .lean(true).exec()
        .then(profiles => {
            if (!profiles || profiles == [])  throw new NotFoundError("Profiles not found");

            res.json(profiles).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

profileRouter.get('/by-schema/:validation_schema_name', (req, res) => {
    Profile.find({
            validation_schema_name: req.params.validation_schema_name,
            application_key: req.moti.application_key
        })
        .lean(true).exec()
        .then(profiles => {
            if (!profiles || profiles == [])  throw new NotFoundError("Profiles not found");

            res.json(profiles).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

profileRouter.get('/by-owner/:owner_id', (req, res) => {
    Profile.find({
            owner_id: req.params.owner_id,
            application_key: req.moti.application_key
        }).lean(true).exec()
        .then(profiles => {
            if (!profiles || profiles == [])  throw new NotFoundError("Profiles not found");

            res.json(profiles).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

profileRouter.post('/', (req, res) => {
    let profileObj = req.body;
    profileObj.application_key = req.moti.application_key;

    validateProfile(profileObj)
        .then((profile) => {
            let profileDb = new Profile(profile);
            return profileDb.save();
        })
        .then(profile => {
            res.json(profile).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

profileRouter.get('/:validation_schema_name/:owner_id', (req, res) => {
    Profile.findOne({
            owner_id: req.params.owner_id,
            validation_schema_name: req.params.validation_schema_name,
            application_key: req.moti.application_key
        }).lean(true).exec()
        .then(profile => {
            if (!profile || profile == [])  throw new NotFoundError("Profile not found");

            res.json(profile).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

profileRouter.get('/:validation_schema_name/:owner_id/raw', (req, res) => {
    Profile.findOne({
            owner_id: req.params.owner_id,
            validation_schema_name: req.params.validation_schema_name,
            application_key: req.moti.application_key
        }).lean(true).exec()
        .then(profile => {
            if (!profile || profile == [])  throw new NotFoundError("Profile not found");

            res.json(JSON.parse(profile.profile)).status(200);
        })
        .catch((err) => handleControllerError(err, res));
});

profileRouter.put("/:validation_schema_name/:owner_id", (req, res) => {
    let updateProfile = (profile, newProfile) => {
        if (!profile) throw new NotFoundError("Profile not found");

        profile.set("profile", newProfile.profile);
        return new Promise((resolve, reject) => {
            resolve(profile);
        });
    }

    let profileObj = req.body;
    profileObj.application_key = req.moti.application_key;
    profileObj.validation_schema_name = req.params.validation_schema_name;
    profileObj.owner_id = req.params.owner_id;

    Profile.findOne({
        owner_id: profileObj.owner_id,
        validation_schema_name: profileObj.validation_schema_name,
        application_key: profileObj.application_key
    }).exec()
    .then((profile) => updateProfile(profile, profileObj))
    .then((profile) => validateProfile(profile))
    .then((profile) => profile.save())
    .then(saveResult => {
        res.status('200').json(saveResult).end();
    })
    .catch((err) => handleControllerError(err, res));
});

profileRouter.patch("/:validation_schema_name/:owner_id", (req, res) => {
    let patchProfileObject = (profile, newProfile) => {
        if (!profile) throw new NotFoundError("Profile not found");
        let currentProfile = JSON.parse(profile.profile);
        let patchProfile = JSON.parse(newProfile.profile);

        profile.set("profile", JSON.stringify(_merge(currentProfile, patchProfile)));
        return new Promise((resolve, reject) => {
            resolve(profile);
        });
    }

    let profileObj = req.body;
    profileObj.application_key = req.moti.application_key;
    profileObj.validation_schema_name = req.params.validation_schema_name;
    profileObj.owner_id = req.params.owner_id;

    Profile.findOne({
        owner_id: profileObj.owner_id,
        validation_schema_name: profileObj.validation_schema_name,
        application_key: profileObj.application_key
    }).exec()
    .then((profile) => patchProfileObject(profile, profileObj))
    .then((profile) => validateProfile(profile))
    .then((profile) => profile.save())
    .then(saveResult => {
        res.status('200').json(saveResult).end();
    })
    .catch((err) => handleControllerError(err, res));
});

profileRouter.delete("/:validation_schema_name/:owner_id", (req, res) => {
    let deleteProfile = (profile) => {
        if (!profile) throw new NotFoundError("Profile not found");

        return profile.remove();
    };

    Profile.findOne(
        {
            owner_id: req.params.owner_id,
            validation_schema_name: req.params.validation_schema_name,
            application_key: req.moti.application_key
        })
        .exec()
        .then((profile) => deleteProfile(profile))
        .then(val => {
            res.status('200').json("Profile deleted").end();
        })
        .catch((err) => handleControllerError(err, res));
});

export default profileRouter;