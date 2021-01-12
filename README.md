# DriveBC connector mock

## Usage

### Start docker

```shell
git checkout https://github.com/eugene-patsiomkin/drivebc-connector-mock.git
cd drivebc-connector-mock
.\run-containers.ps1 -CMD up
```

Database for events can be cleaned through mongo console or by running

```shell
.\run-containers.ps1 -CMD down
```

To run all containers add an -all flag to command.

```shell
.\run-containers.ps1 -CMD up -all 1
```

Other flags available

 -content - to start cms
 -integration - to start camel integrations
 -metrics - to start beats (metrics beat, file beat, heart beat)

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
