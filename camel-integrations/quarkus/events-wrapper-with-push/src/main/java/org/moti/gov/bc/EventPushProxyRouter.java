package org.moti.gov.bc;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.model.dataformat.JsonLibrary;
import org.apache.camel.model.rest.RestBindingMode;

public class EventPushProxyRouter extends RouteBuilder {
    WebHooksList webHooks = new WebHooksList();

    @Override
    public void configure() {
        restConfiguration().component("netty-http").bindingMode(RestBindingMode.json)
                .dataFormatProperty("prettyPrint", "true").contextPath("/integration").port("8877").host("0.0.0.0");

        rest().description("Event webhooks management").consumes("application/json").produces("application/json")
            .post("/webhooks").enableCORS(true)
                .route()
                .bean(webHooks, "addUrl")
                .bean(webHooks, "getWebHooks")
                .endRest()
            .delete("/webhooks").enableCORS(true)
                .route()
                    .bean(webHooks, "deleteUrl")
                    .bean(webHooks, "getWebHooks")
                .endRest()
            .get("/webhooks").enableCORS(true)
                .route()
                    .bean(webHooks, "getWebHooks")
                .endRest();

        rest().description("Create integration")
            .consumes("application/json").produces("application/json")
            .post("/events").enableCORS(true)
                .route()
                    .multicast()
                    .parallelProcessing()
                        .to(
                            "seda:CreateEvent"
                            , "seda:PushEventNotification"
                            , "seda:NotifyWebHooks"
                        )
                    .end()
                    .unmarshal().json(JsonLibrary.Jackson)
            .endRest();

        from("seda:NotifyWebHooks")
            .process(new Processor(){
                @Override
                public void process(Exchange exchange) {
                    exchange.getIn().setHeader("webHookList", webHooks.getWebHooks().values());
                }
            })
            .split(simple("${header.webHookList}")).parallelProcessing()
                .toD("netty:tcp://${body}?disconnectOnNoReply =true")
            .end()
        .end();

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