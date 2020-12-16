package org.moti.events.models.driveBC.camera;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.moti.events.models.Geometry;
import org.moti.events.models.moti.camera.Camera;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Webcams {
    public Links links;
    public Number id;
    public Boolean isOn;
    public Boolean shouldAppear;
    public Region region;
    public RegionGroup regionGroup;
    public Highway highway;
    public String camName;
    public String caption;
    public String credit;
    public String dbcMark;
    public String orientation;
    public Location location;
    public  Weather weather;
    public Message message;
    public Map map;
    public Boolean isNew;
    public Boolean isOnDemand;
    public ImageStats imageStats;

    public Camera toMotiCamera(){

        Camera camera =  new Camera();
        camera.camera_id = id;
        camera.isOn = isOn;
        camera.name = camName;
        camera.caption = caption;
        camera.orientation = orientation;
        camera.altitude = location.elevation;
        camera.geometry = new Geometry();

        camera.geometry.type = "Point";
        camera.geometry.coordinates = new Number[]{
            location.longitude, location.latitude, location.elevation
        };

        return camera;
    }
}
