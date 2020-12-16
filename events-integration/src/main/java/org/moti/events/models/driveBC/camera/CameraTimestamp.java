package org.moti.events.models.driveBC.camera;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class CameraTimestamp {
    public String time;
    public String seconds;
}
