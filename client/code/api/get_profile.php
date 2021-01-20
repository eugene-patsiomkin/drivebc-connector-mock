<?php 
require('tools.php');

function GetCamerInfo($id)
{
    $d = get_camera_info_by_id($id);
    if($d->error)
    {
        echo $d->error_msg;
        die();
    }
    $p = json_decode($d->data);

    return array("name"=>$p->name, "caption"=>$p->caption, "camera_id"=> $id );
}

$d = get_profile();
if($d->error)
{
    echo $d->error_msg;
    die();
}
$p = json_decode($d->data,true);

foreach($p["favorites"]["cameras"] as $key=>$id)
{
    $p["favorites"]["cameras"][$key] = GetCamerInfo($id);
}
echo json_encode($p);
?>