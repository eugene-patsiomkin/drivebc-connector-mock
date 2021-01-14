package org.moti.events.models.dit;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Event {
    static class MotiEvent extends org.moti.events.models.moti.event.Event {}
    static class MotiEventSchedule extends org.moti.events.models.moti.event.EventSchedule {
        public MotiEventSchedule(String from, String to) {
            super(from, to);
        }
    }

    public String ID;
    public String CAUSE;
    public String SEVERITY;
    public String ADVISORYMESSAGE;
    public String TYPE;
    public String TRAFFICPATTERN;
    public JsonNode GEOMETRY;
    public String ROUTE;
    public String STATE;
    public String DISTRICT;
    public String CREATEDTIME;
    public String LOCALUPDATETIME;

    public MotiEvent toMotiEvent() {

        MotiEvent mEvent = new MotiEvent();
        //Geometry
        mEvent.geometry = GEOMETRY;

        mEvent.bid = "DIT_"+ID;

        List<String> tags = new ArrayList<>();
        tags.add(CAUSE);
        tags.add(SEVERITY);
        tags.add(TYPE);
        tags.add(TRAFFICPATTERN);
        tags.add(ROUTE);
        tags.add(DISTRICT);

        mEvent.type.tags = tags.toArray(mEvent.type.tags);

        // Type
        mEvent.type.active = STATE.equalsIgnoreCase("Ongoing");
        mEvent.type.planned = true;
        mEvent.type.severity = SEVERITY.toUpperCase();

        // Info
        mEvent.info.headline = SEVERITY + " " + TYPE + ": " + ROUTE;
        mEvent.info.description = ADVISORYMESSAGE;

        mEvent.schedule = new MotiEventSchedule[]{
                new MotiEventSchedule(CREATEDTIME, LOCALUPDATETIME)
        };

        return mEvent;
    }
}
