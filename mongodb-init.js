db.createUser(
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

db.createUser(
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
);