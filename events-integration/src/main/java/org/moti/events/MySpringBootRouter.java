package org.moti.events;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.http.base.HttpOperationFailedException;
import org.moti.events.models.open511.EventList;
import org.springframework.stereotype.Component;

/**
 * A simple Camel route that triggers from a timer and calls a bean and prints to system out.
 * <p/>
 * Use <tt>@Component</tt> to make Camel auto detect this route when starting.
 */
@Component
public class MySpringBootRouter extends RouteBuilder {
    @Override
    public void configure() {
        JacksonDataFormat open511 = new JacksonDataFormat(EventList.class);
        onException(HttpOperationFailedException.class)
                .to("stream:out");

        from("timer:getEvents?period={{timer.period}}").routeId("open511")
            .to("http://api.open511.gov.bc.ca/events?limit=500&format=json")
            .convertBodyTo(String.class).unmarshal(open511)
            .bean("Open511ToEvents", "toMotiEventJson")
                .end()
            .split(body())
                .to("direct:PostEvents")
                .end()
            .to("stream:out");

        from("direct:PostEvents").routeId("Post events")
            .setHeader("CamelHttpMethod", constant("POST"))
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("Accept", constant("application/json"))
            .marshal().json()
//            .setHeader("apikey", constant("drivebc-api-key"))
//            .to("http://localhost:8000/api/events/v1/events");
           .to("http://moti-events:8080/events");
//        .to("http://postman-echo.com/post?proxyAuthHost=kamproxy.corp.advancedsolutions.eds.com&proxyAuthPort=8080")
    }
}