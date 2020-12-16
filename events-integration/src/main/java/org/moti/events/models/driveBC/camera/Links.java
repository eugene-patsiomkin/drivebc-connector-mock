package org.moti.events.models.driveBC.camera;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Links {
    public String self;
    public String imageSource;
    public String imageDisplayAPI;
    public String imageThumbnailAPI;
    public String imageDisplay;
    public String imageThumbnail;
    public String currentImage;
    public String updateCurrentImage;
    public String replayTheDay;
    public String googleMap;
    public String googleStaticMap;
}
