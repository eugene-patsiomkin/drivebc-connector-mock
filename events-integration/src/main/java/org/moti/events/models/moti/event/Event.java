package org.moti.events.models.moti.event;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;

public class Event {
    public Event(){
        this.info = new EventInfo();
        this.type = new EventType();
        this.type.tags = new String[]{};
        this.schedule = new EventSchedule[]{};
    }

    public JsonNode geometry;
    public String bid;
    public EventSchedule[] schedule;
    public EventInfo info;
    public EventType type;
    @JsonProperty(value="created_on")
    public String createdOn;
    @JsonProperty(value="updated_on")
    public String updatedOn;
}
