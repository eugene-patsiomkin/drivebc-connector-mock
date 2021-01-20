<?php 
    require('tools.php');

    $d = get_camera_image_by_id($_GET['id']);
    if($d->error)
    {
        echo $d->error_msg;
        die();
    }

    header('Content-Type:'.$d->type_data);
    header('Content-Length: '. $d->len_data);

    echo $d->data;
?>
