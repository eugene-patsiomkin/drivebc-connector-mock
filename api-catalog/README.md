# API catalog

Nextjs application Utilizes Kong ability to tag objects.

## Tagging strategy

For a tagging example please see postman collection `kong_configuration/events_setup_autodiscover`.
It has list of API calls to set up 2 endpoints.

### Tag syntax

Due to limited character set available for tagging fallowing syntax was selected.

{tag_type}~{tag}
example:

    type~doc
As space character is not allowed by Kong _ is used.
example:

    title~Cool_title
Will be interpreted as ```Cool title```

### API discovery entry point

    API discovery entry point is always anchored on API documentation.

    You can use any other tags for additional metadata as required by your business.

To create an entry point first create an entry point service (see postman collection for an example).
Additionally to mandatory service fields, it should be also be tagged with:

    type~document
    title~Service_title
    description~Service_description

Route should be created for an entry point service.
Route should be tagged:

    type~document_link

### Adding available API endpoints

Create service(s) and tag them

    type~endpoint
    root~(entry point service name)

For each API endpoint create route(s) tagged:

    group~(group name) - Use plugin used for authorization to simplify.
    currently supports group~authkey and group~cert

    acl~read-event - acl role required to access route.

**Note** Make sure to add and configure appropriate access plugins for routes created.

### API Catalog application

Currently application can:

* List tagged services
* Provide access to it's documentation.
* Show routes exposed to a user and authorization plugins applied.
* Self serve access keys generator keys for authorization plugin. User also automatically added to appropriate ACL group.

## Final thoughts

**Do not use in Production** Purpose of application is to demonstrate Kong Gateway possibilities and developer API catalog functionality.
