package org.moti.events.models.driveBC.camera;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Message {
    @JsonProperty(value="short")
    public String shortMessage;
    @JsonProperty(value="long")
    public String longMessage;
}
