package org.moti.events;

import org.apache.camel.LoggingLevel;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.http.base.HttpOperationFailedException;
import org.moti.events.models.driveBC.camera.WebcamsList;
import org.springframework.stereotype.Component;

/**
 * A simple Camel route that triggers from a timer and calls a bean and prints to system out.
 * <p/>
 * Use <tt>@Component</tt> to make Camel auto detect this route when starting.
 */
@Component
public class MotiImagesRouter extends RouteBuilder {
    @Override
    public void configure() {
        JacksonDataFormat dbcWebcam = new JacksonDataFormat(WebcamsList.class);
        onException(HttpOperationFailedException.class)
                .log(LoggingLevel.INFO, "Error sending camera info to images app");

        from("timer:getImages?period={{timer.period}}").routeId("Get Images")
            .to("https://images.drivebc.ca/webcam/api/v1/webcams?pp")
            .log(LoggingLevel.INFO, "Getting camera list from images.drivebc.ca")
            .convertBodyTo(String.class).unmarshal(dbcWebcam)
            .bean("DriveBCWebcamsToCameras", "toMotiCamerasJson")
                .end()
            .split(body())
                .to("direct:PostImages")
                .end()
            .log(LoggingLevel.INFO, "All cameras submitted.");

        from("direct:PostImages").routeId("Post images")
            .setHeader("CamelHttpMethod", constant("POST"))
            .setHeader("Content-Type", constant("application/json"))
            .setHeader("Accept", constant("application/json"))
            .setHeader("Connection", constant("keep-alive"))
            .setHeader("Accept-Encoding", constant("gzip, deflate, br"))
            .marshal().json()
            .to("stream:out")
//            .to("http://localhost:7763/cameras/");
           . to("http://moti-images:8080/cameras")
            .log(LoggingLevel.INFO, "Camera info submitted");
    }
}