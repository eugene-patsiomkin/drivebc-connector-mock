package org.moti.events.models.open511;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties
public class Pagination {
    public String offset;
    public String limit;
    @JsonProperty(value="next_url")
    public String nextUrl;
    @JsonProperty(value="previous_url")
    public String previousUrl;
}
