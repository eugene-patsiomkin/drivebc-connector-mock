package org.moti.events.models.driveBC.camera;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class WebcamsList {
    public Links links;
    public Webcams[] webcams;
}
