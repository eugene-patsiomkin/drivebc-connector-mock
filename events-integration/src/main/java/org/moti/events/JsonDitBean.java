package org.moti.events;

import org.moti.events.models.moti.event.Event;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("DitToEvents")
public class JsonDitBean {
    public Event[] toMotiEventJson(org.moti.events.models.dit.Event[] eventList){
        List<Event> mEvents = new ArrayList<>();

        for (int i = 0; i < eventList.length; i++) {
            mEvents.add(eventList[i].toMotiEvent());
        }

        Event[] eventsArray = new Event[]{};
        eventsArray = mEvents.toArray(eventsArray);

        return eventsArray;
    }
}
