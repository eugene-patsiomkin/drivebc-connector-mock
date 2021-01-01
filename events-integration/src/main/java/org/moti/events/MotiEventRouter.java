package org.moti.events;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.http.base.HttpOperationFailedException;
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
        onException(HttpOperationFailedException.class)
                .log(LoggingLevel.INFO, "Error sending event info to event app");

        from("timer:getEvents?period={{timer.period}}").routeId("Get open511")
            .to("http://api.open511.gov.bc.ca/events?limit=500&format=json")
            .log(LoggingLevel.INFO, "Getting events from api.open511.gov.bc.ca")
            .convertBodyTo(String.class).unmarshal(open511)
            .bean("Open511ToEvents", "toMotiEventJson")
                .end()
            .split(body())
                .to("direct:PostEvents")
                .end()
            .log(LoggingLevel.INFO, "All events submitted api.open511.gov.bc.ca");

        from("direct:PostEvents").routeId("Post events")
            .setHeader("CamelHttpMethod", constant("POST"))
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("Accept", constant("application/json"))
            .marshal().json()
//            .to("http://localhost:8000/api/events/v1/events");
            .to("http://moti-events:8080/events")
            .log(LoggingLevel.INFO, "Event is posted to event API");
    }
}