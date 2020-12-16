package org.moti.events.models.driveBC.camera;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class ImageStats {
    public String md5;
    public CameraTimestamp lastAttempt;
    public CameraTimestamp lastModified;
    public Boolean markedStale;
    public Boolean markedDelayed;
    public Integer updatePeriodMean;
    public Integer updatePeriodStdDev;
    public Integer fetchMean;
}
