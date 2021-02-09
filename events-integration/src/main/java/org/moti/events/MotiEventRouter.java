package org.moti.events;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.http.base.HttpOperationFailedException;
import org.apache.camel.model.rest.RestBindingMode;
import org.moti.events.models.open511.EventList;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * A simple Camel route that triggers from a timer and calls a bean and prints to system out.
 * <p/>
 * Use <tt>@Component</tt> to make Camel auto detect this route when starting.
 */
@Component
public class MotiEventRouter extends RouteBuilder {
    Map<String, String> jobTemplate = new HashMap<String, String>();
    @Override
    public void configure() {
        JacksonDataFormat open511 = new JacksonDataFormat(EventList.class);
        JacksonDataFormat dit = new JacksonDataFormat(org.moti.events.models.dit.Event[].class);
        onException(HttpOperationFailedException.class)
                .log(LoggingLevel.INFO, "Error sending event info to event app");

        restConfiguration().component("jetty").bindingMode(RestBindingMode.json)
            .dataFormatProperty("prettyPrint", "true")
            .contextPath("/integration").port("8888").host("localhost");

        from("timer:getEvents?period={{timer.period}}").routeId("Get open511")
            .to("http://api.open511.gov.bc.ca/events?bridgeEndpoint=true&limit=500&format=json")
            .log(LoggingLevel.INFO, "Getting events from api.open511.gov.bc.ca")
            .convertBodyTo(String.class).unmarshal(open511)
            .bean("Open511ToEvents", "toMotiEventJson")
                .end()
            .split(body())
                .to("direct:PostEvents")
                .end()
            .log(LoggingLevel.INFO, "All events submitted api.open511.gov.bc.ca");

        rest("/dit").description("Working with dit integrations")
            .consumes("application/json").produces("application/json")
            .get("/startJob")
                .to("seda:GetDitEvents");

        from("seda:GetDitEvents").routeId("Get dit events")
            .to("http://tst.th.gov.bc.ca/DriveBC_API/v1/events?bridgeEndpoint=true&format=json")
            .log(LoggingLevel.INFO, "Getting events from dit")
            .convertBodyTo(String.class).unmarshal(dit)
            .bean("DitToEvents", "toMotiEventJson")
                .end()
            .split(body())
                .to("direct:PostEvents")
                .end()
            .log(LoggingLevel.INFO, "All dit events are submitted")
            .setBody(constant("All dit events are sent to an API endpoint"));

        from("direct:PostEvents").routeId("Post events")
            .setHeader("CamelHttpMethod", constant("POST"))
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("Accept", constant("application/json"))
            .marshal().json()
            .to("http://integrations-proxy:8877/integration/events?bridgeEndpoint=true")
            .log(LoggingLevel.INFO, "Event is posted to event API");
    }
}