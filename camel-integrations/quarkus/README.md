# Camel Quarkus integrations

## Container building

To build all containers use ```../builds_integrations.ps1``` script.
Or just build individual containers by running ```.\mvnw clean package``` from the root integration folder. Check Quarkus documentation for more information.

* ```CMS``` CMS integration example. Wraps ghost API for easier, provider independent access to information based on consumer type. see ```CMSProxyRouter.java``` for details.

* ```Event push``` Proxy that is used to deliver events created to an API endpoint as well as registered webhooks. Uses Camel Rest component.

* ```Weather Canada integration``` Loads Weather Canada information for BC cities on schedule. For version with API integrated visit [Weather Canada With REST API](https://github.com/eugene-patsiomkin/quarkus-demo/tree/main/2-weather-canada-app)