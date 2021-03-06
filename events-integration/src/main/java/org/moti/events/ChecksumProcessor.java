package org.moti.events;

import org.apache.camel.Exchange;
import org.apache.camel.Processor;
import org.apache.commons.codec.digest.DigestUtils;

import java.security.NoSuchAlgorithmException;

public class ChecksumProcessor implements Processor {
    private java.util.Base64.Encoder encoder = java.util.Base64.getEncoder();

    public void process(Exchange exchange) throws NoSuchAlgorithmException {
        byte[] bytes = exchange.getIn().getBody(byte[].class);
        String hash= DigestUtils.sha1Hex(bytes);
        exchange.getIn().setHeader("Checksum", hash);
    }
}
