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