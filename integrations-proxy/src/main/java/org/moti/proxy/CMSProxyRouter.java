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
public class CMSProxyRouter extends RouteBuilder {
    @Override
    public void configure() {

        restConfiguration().component("jetty").bindingMode(RestBindingMode.json)
            .dataFormatProperty("prettyPrint", "true")
            .contextPath("/integration").port("8877").host("0.0.0.0");

        rest("/content").description("CMS commuter integration")
            .consumes("application/json").produces("application/json")
            .get("/commuter/main").enableCORS(true)
                .route()
                    .to("seda:GetCommuterMainMessage")
                    .unmarshal().json(JsonLibrary.Jackson)
                .endRest();

        from("seda:GetCommuterMainMessage")
            .setHeader(Exchange.HTTP_QUERY, constant("key=7c06d112f7453ec8871b62179a"))
            .to("http://ghost:2368/ghost/api/v3/content/posts/slug/daily-commuter/?bridgeEndpoint=true&connectionClose=true&copyHeaders=true")
            .convertBodyTo(String.class)
        .end();

        rest("/content").description("CMS commuter integration")
            .consumes("application/json").produces("application/json")
            .get("/commercial/main").enableCORS(true)
                .route()
                    .to("seda:GetCommercialMainMessage")
                    .unmarshal().json(JsonLibrary.Jackson)
                .endRest();

        from("seda:GetCommercialMainMessage")
            .setHeader(Exchange.HTTP_QUERY, constant("key=7c06d112f7453ec8871b62179a"))
            .to("http://ghost:2368/ghost/api/v3/content/posts/slug/commercial-drive/?bridgeEndpoint=true&connectionClose=true&copyHeaders=true")
            .convertBodyTo(String.class)
        .end();
    }
}