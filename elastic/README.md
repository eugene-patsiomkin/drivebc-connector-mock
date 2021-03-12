# Kibana configuration

* ```export.ndjson``` Sample dashboards for zipkin.
* ```http_dashboards.ndjson``` Copy of default dashboards for (hearbeat). As it does not have create dashboards capability.
* ```zipkin-span-template.json``` Updated zipkin template to get access to tag properties. Only difference from original template in ```mappings.tags```. Changes can be done through Kibana GUI.
