<?php
function GetData($url)
{
    $opts = array (
        'http'=>array(
            'method'=>"GET",
            'header'=>"accept: application/json\r\n".
                "application_id: demo-application-key\r\n".
                "apikey: drivebc-profiles-api-key\r\n"
        )
    );
    
    $contest = stream_context_create($opts);
    $data = file_get_contents($url,false,$contest);
    return $data;
}
?>