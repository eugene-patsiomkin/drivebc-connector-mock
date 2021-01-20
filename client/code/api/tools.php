<?php
require('api_const.php');

function call_API_byID($url,$headers)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
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
    $ret->len_data = curl_getinfo($curl,CURLINFO_CONTENT_LENGTH_DOWNLOAD);
    $ret->type_data = curl_getinfo($curl,CURLINFO_CONTENT_TYPE);

    curl_close($curl);

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

?>
