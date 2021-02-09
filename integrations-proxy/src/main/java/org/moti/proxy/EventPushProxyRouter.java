package org.moti.proxy;

import org.apache.camel.Exchange;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.dataformat.JsonLibrary;
import org.apache.camel.model.rest.RestBindingMode;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * A simple Camel route that triggers from a timer and calls a bean and prints to system out.
 * <p/>
 * Use <tt>@Component</tt> to make Camel auto detect this route when starting.
 */
@Component
public class EventPushProxyRouter extends RouteBuilder {
    Map<String, String> jobTemplate = new HashMap<String, String>();
    @Override
    public void configure() {

        rest().description("Create integration")
            .consumes("application/json").produces("application/json")
            .post("/events").enableCORS(true)
                .route()
                    .multicast()
                    .parallelProcessing()
                        .to("seda:CreateEvent")
                        .to("seda:PushEventNotification")
                    .end()
                    .unmarshal().json(JsonLibrary.Jackson)
            .endRest();

        from("seda:PushEventNotification")
            .setHeader("CamelHttpMethod", constant("POST"))
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("Accept", constant("application/json"))
            .marshal().json()
            .to("http://moti-events-push:8080/event?bridgeEndpoint=true")
            .end();


        from("seda:CreateEvent")
            .setHeader("CamelHttpMethod", constant("POST"))
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("Accept", constant("application/json"))
            .marshal().json()
            .to("http://moti-events:8080/events?bridgeEndpoint=true")
            .end();
    }
}