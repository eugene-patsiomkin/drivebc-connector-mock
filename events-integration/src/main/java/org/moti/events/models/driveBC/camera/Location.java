package org.moti.events.models.driveBC.camera;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Location {
    public Links links;
    public Number latitude;
    public Number longitude;
    public Number elevation;
}
