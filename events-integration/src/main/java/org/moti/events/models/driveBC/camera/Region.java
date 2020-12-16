package org.moti.events.models.driveBC.camera;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Region {
    public Links links;
    public String name;
    public Integer group;
}
