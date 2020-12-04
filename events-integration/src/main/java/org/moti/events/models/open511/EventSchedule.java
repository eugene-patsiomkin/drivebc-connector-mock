package org.moti.events.models.open511;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EventSchedule {
    public String[] intervals;
}
