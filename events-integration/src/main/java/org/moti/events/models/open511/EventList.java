package org.moti.events.models.open511;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public class EventList {

    public Event[] events;
    public Pagination pagination;
    public Meta meta;
}
