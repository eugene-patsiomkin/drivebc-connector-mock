package org.moti.events.models.moti.event;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EventInfo {
    public String headline;
    public String description;

    @JsonProperty(value = "related_events")
    public String[] relatedEvents;

    @JsonProperty(value = "related_urls")
    public String[] relatedUrls;
}
