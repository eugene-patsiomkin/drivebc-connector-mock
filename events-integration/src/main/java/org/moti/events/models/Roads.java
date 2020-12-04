package org.moti.events.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties
public class Roads {
    public String name;
    public String from;
    public String to;
    public String direction;
}
