# drivebc-connector-mock

## Usage

### Start docker

```shell
git checkout https://github.com/eugene-patsiomkin/drivebc-connector-mock.git
cd drivebc-connector-mock
docker-compose up
```

### Kong configuration

If running for the first time:

Open postman collection ```postman\dbc_connector.postman_collection.json```

Run **Step 1** through **Step 5** requests in ```kong_configuration```.

### Using API

Open postman collection ```postman\dbc_connector.postman_collection.json```

Run any of  ```api_consumer\*``` requests.
