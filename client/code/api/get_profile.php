<?php 
require('tools.php');

function GetAdvisory()
{
    if(isset($_GET['type']))
    {
        $type = $_GET['type'];
    }
    else {
        $type = PROFILE_COMMUTER;
    }


    $d = get_advisory_by_type($type);
    if($d->error)
    {
        echo $d->error_msg;
        die();
    }

    $stdout = fopen('php://stdout', 'w');
    fwrite($stdout, var_export($d, true) . PHP_EOL);
    fclose($stdout);

    $p = json_decode($d->data);
    return array("title"=>$p->posts[0]->title, "html"=>$p->posts[0]->html, "excerpt"=> $p->posts[0]->excerpt,"url"=>$p->posts[0]->url );
}

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

$p["advisory"]=GetAdvisory();

echo json_encode($p);
?>