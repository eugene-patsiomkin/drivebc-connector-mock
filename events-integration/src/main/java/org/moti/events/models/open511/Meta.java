package org.moti.events.models.open511;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public class Meta {
    public String url;

    @JsonProperty(value="up_url")
    public String upUrl;
    public String version;
}
