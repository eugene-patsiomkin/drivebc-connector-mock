package org.moti.events;


import org.moti.events.models.moti.event.Event;
import org.moti.events.models.open511.EventList;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("Open511ToEvents")
public class JsonOpen511Bean {
    public Event[] toMotiEventJson(EventList eventList){
        List<Event> mEvents = new ArrayList<Event>();

        for (int i = 0; i < eventList.events.length; i++) {
            mEvents.add(eventList.events[i].toMotiEvent());
        }

        Event[] eventsArray = new Event[]{};
        eventsArray = mEvents.toArray(eventsArray);

        return eventsArray;
    }
}
