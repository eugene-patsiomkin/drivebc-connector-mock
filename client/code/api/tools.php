<?php
require('api_const.php');

function call_API_byID($url,$headers)
{
    $stdout = fopen('php://stdout', 'w');
    fwrite($stdout, $url . PHP_EOL);
    
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_PROXY, '');
    if(count($headers) > 0)
    {
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    }
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    
    $ret = (object) [
        'error' => false,
        'error_msg' => '',
        'len_data' => '',
        'type_data' => '',
        'data' => ''
      ];

    $ret->data = curl_exec($curl);

    if (curl_errno($curl)) {
        $ret->error=true;
        $ret->error_msg =  curl_error($curl);
    }    

    fwrite($stdout, ">>>>>>>>>>>>>>>>>>>>>>" . print_r(curl_getinfo($curl,CURLINFO_CONTENT_LENGTH_DOWNLOAD), true) . PHP_EOL);


    $ret->len_data = curl_getinfo($curl,CURLINFO_CONTENT_LENGTH_DOWNLOAD);
    $ret->type_data = curl_getinfo($curl,CURLINFO_CONTENT_TYPE);

    curl_close($curl);
    fclose($stdout);

    return $ret;
}

function get_date_time($d)
{
    $dt = new DateTime($d); //, new DateTimeZone('America/Vancouver'));
    $dt->setTimeZone(new DateTimeZone('America/Vancouver'));
    return $dt->format('Y-m-d H:i:s T');
}

function get_event_by_id($id)  // $id - event id
{
    $headers = array("apikey: drivebc-api-key");
    return call_API_byID(EVENTS_URL.$id,$headers);
}

function get_camera_info_by_id($id)  // $id - camera id
{
    $headers = array("apikey: drivebc-api-key");
    return call_API_byID(CAMERA_INFO_URL.$id,$headers);
}

function get_profile()
{
    $headers = array("accept: application/json",
                    "application_id: demo-application-key",
                    "apikey: drivebc-profiles-api-key");

    return call_API_byID(PROFILE_URL,$headers);
}

function get_geofence_events($id) // $id - geofence id
{
    $headers = array("apikey: drivebc-api-key");

    return call_API_byID(GEOFENCE_EVENTS_URL.$id,$headers);
}

function get_geofence_cameras($id) // $id - geofence id
{
    $headers = array("apikey: drivebc-api-key");

    return call_API_byID(GEOFENCE_CAMERAS_URL.$id,$headers);
}

function get_camera_image_by_id($id) // $id - camera id
{
    $headers = array("apikey: drivebc-images-api-key");

    return call_API_byID(CAMERA_IMAGE_URL.$id."/current",$headers);
}

function get_geofenca_by_id($id) // $id - geofence id
{
    $headers = array("apikey: drivebc-api-key");

    return call_API_byID(GEOFENCE_URL.$id,$headers);
}

function get_advisory_by_type($type) // $id - geofence id
{
    $headers = array("apikey: drivebc-api-key");
    switch($type)
    {
        case PROFILE_COMMUTER:
            $id = 'commuter/main?key=6c993674680092a5fe1056182d';
            break;
        case PROFILE_COMMERCIAL:
            $id = 'commercial/main?key=6c993674680092a5fe1056182d';
            break;
        default:
            return [];
    }

    return call_API_byID(ADVISORY_URL.$id,$headers);
}

?>
