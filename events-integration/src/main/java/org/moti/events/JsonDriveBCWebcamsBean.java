package org.moti.events;


import org.moti.events.models.driveBC.camera.WebcamsList;
import org.moti.events.models.moti.camera.Camera;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component("DriveBCWebcamsToCameras")
public class JsonDriveBCWebcamsBean {
    public Camera[] toMotiCamerasJson(WebcamsList webcamsList){
        List<Camera> mCamera = new ArrayList<Camera>();

        for (int i = 0; i < webcamsList.webcams.length; i++) {
            mCamera.add(webcamsList.webcams[i].toMotiCamera());
        }

        Camera[] camerasArray = new Camera[]{};
        camerasArray = mCamera.toArray(camerasArray);

        return camerasArray;
    }
}
