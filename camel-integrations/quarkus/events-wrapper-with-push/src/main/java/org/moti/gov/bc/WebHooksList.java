package org.moti.gov.bc;

import java.util.HashMap;
import org.apache.commons.codec.digest.DigestUtils;

/**
 * WebHooksList
 */
public class WebHooksList {
    private HashMap<String, String> webHooks;

    public WebHooksList() {
        this.webHooks = new HashMap<String, String>();
        this.addUrl("moti-events-push:8080/event");
    }

    public String getKey(String value) {
        return DigestUtils.md5Hex(value); 
    }

    public HashMap<String, String> getWebHooks() {
        return this.webHooks;
    }

    public void addUrl(String url) {
        this.webHooks.put(
            this.getKey(url)
            , url
        );
    }

    public void deleteUrl(String url) {
        this.webHooks.remove(
            this.getKey(url)
        );
    }

    public void clearHooks() {
        this.webHooks.clear();
    }
}