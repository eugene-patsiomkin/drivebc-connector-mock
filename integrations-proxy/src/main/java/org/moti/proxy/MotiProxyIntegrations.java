package org.moti.proxy;

import org.apache.camel.zipkin.starter.CamelZipkin;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
@CamelZipkin
public class MotiProxyIntegrations {

    /**
     * A main method to start this application.
     */
    public static void main(String[] args) {
        SpringApplication.run(MotiProxyIntegrations.class, args);
    }
}
