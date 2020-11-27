import express from "express";
import Models from '../db.js'
// import {
//     create
// } from "xmlbuilder2";
import js2xmlparser  from "js2xmlparser";

import _isArray from 'lodash/isArray.js'

const eventRouter = express.Router();
const Event = Models.Event;

const EventsToXML = (evt) => {
    let getXMLEvent = e => js2xmlparser.parse("event", e).replace(/<\?xml.*\?>/i, '');
    let xml = '<?xml version="1.0"?>'
    let cleanEvt = JSON.parse(JSON.stringify(evt));
    if (!_isArray(cleanEvt)) {
        xml += getXMLEvent(cleanEvt);
    } else {
        xml+='<events>'
        cleanEvt.forEach(e => xml += getXMLEvent(e));
        xml+="</events>"
    }

    return xml;
};

const EventsToJeoJSONString = (evts) => {
    let mapEventToGeoJSON = e => {
        e = JSON.parse(JSON.stringify(e));
        e.geometry = e.geometry || {};
        let feature = {
            type: "Feature",
            geometry: {... e.geometry},
            properties: {... e}
        }

        delete feature.properties.geometry;
        return feature;
    }

    let result;
    if (_isArray(evts)) {
        result = {
            type: "FeatureCollection",
            features: evts.map(mapEventToGeoJSON)
        }
    } else {
        result = mapEventToGeoJSON(evts);
    }

    return JSON.stringify(result);
}

const mapEventResponse = (req) => {
    let result = {content_type: null, data: null};
    switch (true) {
        case req.accepts("application/geo+json") == "application/geo+json":
            result.content_type = 'application/geo+json';
            result.data = EventsToJeoJSONString(req.moti.events);
            break;
        case req.accepts("json") == "json":
            result.content_type = 'application/json';
            result.data = JSON.stringify(req.moti.events);

            break;
        case req.accepts("xml") == "xml":
            result.content_type = 'application/xml';
            result.data = EventsToXML(req.moti.events);
            break;
        default:
            result.content_type = 'application/json';
            result.data = JSON.stringify(req.moti.events);
    }

    return result;
}

const mapEventSuccess = (req, res, next) => {
    let data = mapEventResponse(req);
    res.status(200)
        .header('Content-Type', data.content_type)
        .send(data.data);

    delete(req.moti);
    next();
}

eventRouter.get('/', (req, res, next) => {
    Event.find().exec(async (err, result) => {
        if (err) {
            res.json("Error").status('500').end();
            console.log(err);
        } else {
            if (result) {
                req.moti = {events: result};
                next();
            } else {
                res.status('404').end();
            }
        }
    });
}, mapEventSuccess);

eventRouter.get('/:id', (req, res, next) => {
    Event.findOne({bid: req.params.id}).exec(async (err, result) => {
        if (err) {
            res.json("Error").status('500').end();
            console.log(err);
        } else {
            if (result) {
                req.moti = {events: result};
                next();
            } else {
                res.status('404').end();
            }
        }
    });
}, mapEventSuccess);

eventRouter.post("/", (req, res) => {
    let evt = new Event(req.body)
    evt.save( async (err, val) => {
        if (err) {
            res.json(err).status('400').end();
        } else {
            if (val) {
                res.status('200').json(val).end();
            } else {
                res.status('404').end();
            }
        }
    });
});

export default eventRouter;