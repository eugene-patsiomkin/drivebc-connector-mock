package org.moti.events.models.open511;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import org.moti.events.models.Areas;
import org.moti.events.models.Roads;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Arrays;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties
public class Event {
    static class MotiEvent extends org.moti.events.models.moti.Event {}
    static class MotiEventSchedule extends org.moti.events.models.moti.EventSchedule {}
    public String url;

    @JsonProperty(value="jurisdiction_url")
    public String jurisdictionUrl;
    public String headline;
    public String id;
    public String status;
    public String created;
    public String updated;
    public String description;

    @JsonProperty(value="+ivr_message")
    public String ivrMessage;

    @JsonProperty(value="+linear_reference_km")
    public String linearReferenceKM;
    public EventSchedule schedule;
    @JsonProperty(value="event_type")
    public String eventType;
    @JsonProperty(value="event_subtypes")
    public String[] eventSubtypes;
    public String severity;
    public JsonNode geography;
    public Roads[] roads;
    public Areas[] areas;

    public MotiEvent toMotiEvent()
    {
        // Init
        MotiEvent mEvent = new MotiEvent();

        //Geometry
        mEvent.geometry = geography;

        //Event id
        mEvent.bid = id;

        // Mapping tags
        List<String> tags = new ArrayList<String>(Arrays.asList(eventSubtypes));
        tags.add(eventType);
        tags.add(status);
        mEvent.type.tags = tags.toArray(mEvent.type.tags);

        // Type
        mEvent.type.active = status.toLowerCase().equals("active");
        mEvent.type.planned = true;
        mEvent.type.severity = severity;


        // Info
        mEvent.info.headline = headline;
        mEvent.info.description = description;

        // Schedule
        mEvent.schedule = new MotiEventSchedule[]{
            new MotiEventSchedule()
        };

        return mEvent;
    }
}
