# DriveBC connector mock

## Usage

### Start docker

```shell
git checkout https://github.com/eugene-patsiomkin/drivebc-connector-mock.git
cd drivebc-connector-mock
docker-compose up --build
```
 
Database for events can be cleaned througn mongo console or by running

```shell
docker-compose down
```

### Kong configuration

If running for the first time:

Open postman collection ```postman\dbc_connector.postman_collection.json```

#### generic API configuration

This is an API from the first Kong setup. Can be skipped.

Run **Step 1** through **Step 5** requests in ```kong_configuration\generic```.

#### Events API configuration

Run **Step 1** through **Step 5** requests in ```kong_configuration\events_setup```.

### Using API

Open postman collection ```postman\dbc_connector.postman_collection.json```

#### Generic API

Run any of  ```api_consumer\*``` requests.

#### Events API

Run any of  ```events\*``` requests.
