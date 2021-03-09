<?php
    date_default_timezone_set("America/New_York");
//    header("Cache-Control: no-cache");
    header("Content-Type: text/event-stream");

    $pipe = "/tmp/my_events";
    $mode = 0600;

    if(!file_exists($pipe))
    {
        umask(0);
        posix_mkfifo($pipe,$mode);
    }

    $f = fopen($pipe,"r+");
    if (!stream_set_blocking($f, false)) {
        Out("Open file");
        die();
    }

    while (1) {

        $r = fread($f,1024);

        if (!$r)
        {
            $curDate = date(DATE_ISO8601);
            echo "event: ping\n",
                'data: {"time": "' . $curDate . '"}', "\n\n";
        }
        else
        {
            echo "data: ".$r."\n\n";
        }

        while (ob_get_level() > 0) {
            ob_end_flush();
        }
        flush();

  
        if ( connection_aborted() ) 
        {
            break;
        }
        sleep(2);
    }
    fclose($f);
?>
