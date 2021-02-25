package org.moti.events;

import org.apache.camel.zipkin.starter.CamelZipkin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import com.rabbitmq.client.ConnectionFactory;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@SpringBootApplication
//@CamelZipkin
public class MotiIntegrations {
    @Autowired
    private Environment env;
    /**
     * A main method to start this application.
     */
    public static void main(String[] args) {
        SpringApplication.run(MotiIntegrations.class, args);
    }

    @Bean
    ConnectionFactory rabbitConnectionFactory() throws KeyManagementException, NoSuchAlgorithmException {
        String username = env.getProperty("amqp.user");
        String password = env.getProperty("amqp.password");
        String host = env.getProperty("amqp.host");

        ConnectionFactory cf = new ConnectionFactory();

        cf.setUsername(username.trim());
        cf.setPassword(password.trim());
        cf.setHost(host.trim());
        cf.setPort(cf.DEFAULT_AMQP_OVER_SSL_PORT);
        cf.setVirtualHost(cf.DEFAULT_VHOST);
        cf.useSslProtocol();

        return cf;
    }
}
