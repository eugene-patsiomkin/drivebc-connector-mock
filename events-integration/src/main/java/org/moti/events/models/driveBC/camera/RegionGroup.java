package org.moti.events.models.driveBC.camera;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class RegionGroup {
    public Integer highwayGroup;
    public Integer highwayCamOrder;
}
