<?php
    $pipe = "/tmp/my_events";
    $mode = 0600;
    header("Status: 200 OK");

    $data = file_get_contents('php://input');
    $f = fopen($pipe,"w");
    fwrite($f,$data);
    fclose($f);
?>