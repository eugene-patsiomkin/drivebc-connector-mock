package org.moti.events;

import org.apache.camel.zipkin.starter.CamelZipkin;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@CamelZipkin
public class MotiIntegrations {

    /**
     * A main method to start this application.
     */
    public static void main(String[] args) {
        SpringApplication.run(MotiIntegrations.class, args);
    }
}
