import events from "./events.js";
import geofence from "./geofences.js";
import tags from "./tags.js";


const Routes = [
    {
        path: "/events",
        route: events
    },
    {
        path: "/geofence",
        route: geofence
    },
    {
        path: "/event-tags",
        route: tags
    }
];

export default Routes;