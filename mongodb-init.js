event_db = db.getSiblingDB('event-db');
event_db.createUser(
    {
        user: "event-api",
        pwd: "event-api",
        roles: [
            {
                role: "readWrite",
                db: "event-db"
            }
        ]
    }
);

profile_db = db.getSiblingDB('profile-db');
profile_db.createUser(
    {
        user: "profile-api",
        pwd: "profile-api",
        roles: [
            {
                role: "readWrite",
                db: "profile-db"
            }
        ]
    }
);;