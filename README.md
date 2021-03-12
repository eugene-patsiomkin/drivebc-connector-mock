# DriveBC connector mock

## Usage

### Getting source

```shell
git checkout https://github.com/eugene-patsiomkin/drivebc-connector-mock.git
cd drivebc-connector-mock
```

### Folder structure

For more information on folder content check its Readme file.

* ```./api``` Nodejs express simple API endpont. Part of first API gateway prototype. Can be ignored.
* ```./api-catalog``` Nextjs application that works with Kong admin api to discover API endpoints and generate keys.
* ```./camel-integrations/quarkus/*``` Camel integrations that used quarkus as a framework.
* ```./client``` PHP frontend drive bc mock. To demonstrate Connector Platform integration possibilities.
* ```./docker-compose``` Docker compose files to run example components individually. Also contains configuration files for Elastic beats (Filebeat, Heartbeat, Metricbeat)
* ```./elastic``` Example configurations for elastic Kibana dashboards and index changes required for access to tag attributes of Zipkin.
* ```./events-endpoint-api``` Event Consumer API prototype. For openapi spec is available in **openapi** folder. Used by the **client** application.
* ```./events-integration``` Open511, Dit and Camera integrations. Camel + Springboot. Use only for camel route examples.
* ```./geostore-endpoint-api``` - An endpoint to store geofences. Used by image and event endpoints.
* ```./images-endpoint-api``` Images Consumer API prototype. For openapi spec is available in **openapi** folder. Used by the **client** application.
* ```./metricbeat``` Configuration for a metric beat container.
* ```./openapi``` Schema exmple for geojson. No API definition.
* ```./postman``` Postman collection.
* ```./profile-endpoint-api``` Profile Consumer API prototype. Simple application to validate json object with stored json schemas. For openapi spec is available in **openapi** folder. Used by the **client** application.
* ```push_events``` Front end node js applications to deliver user events information through web sockets

### Building Camel integrations

Have your Java environment setup (JAVA_HOME)
Run:

```shell
builds_integrations.ps1
```

### Start docker

```shell
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
 -ui - to start php ui

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

#### CMS API call example

http://localhost:8000/api/cms/v1/ghost/api/v3/content/posts/?apikey=cms-api-key&key=7c06d112f7453ec8871b62179a

### Triggering integrations

http://localhost:8888/integration/dit/startJob
