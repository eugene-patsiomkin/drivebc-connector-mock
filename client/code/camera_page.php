<?php
    require('api/tools.php');

    $d = get_camera_info_by_id($_GET['id']);
    if($d->error)
    {
        echo $d->error_msg;
        die();
    }
    $e = json_decode($d->data);
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>DBC Connector</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <link href="style/style.css" rel="stylesheet" />
    <!--<script src="js/api.js"></script>-->

</head>
<body>
    <div class="container-fluid d-flex h-100 flex-column">
        <div class="row border-dark" style="background-color:#004B8D;padding:0;">
            <div class="row w-100">
                <div class="col">
                    <a href="#" class="justify-content-start">
                        <img src="images/DriveBC_Banner_lft_2010_01_04.jpg" />
                    </a>
                </div>
                <div class="d-flex flex-column align-items-end">
                    <div class="mt-auto">
                        <ul class="nav navbar-hor justify-content-end">
                            <li><a href="#">Jennifer</a></li>
                            <li><a href="#">Log Off</a></li>
                        </ul>
                    </div>
                    <div>
                        <ul class="nav navbar-hor justify-content-end">
                            <li><a href="#">Conditions and Events</a></li>
                            <li><a href="#">BC Highway Webcams</a></li>
                            <li><a href="#">CV Height Clearance Tool</a></li>
                            <li><a href="#">Border Delays</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-3"></div>
            <div class="col-5">
                <div class="form pt-2 text-center"><h1>Camera Info</h1></div>
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera ID:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="camera_id" id="camera_id" value="<?php echo $e->camera_id; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera Name:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="c_name" id="c_name" value="<?php echo $e->name; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera Caption:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="caption" id="caption" value="<?php echo $e->caption; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera Orientation:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="orientation" id="orientation" value="<?php echo $e->orientation; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera Altitude:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="altitude" id="altitude" value="<?php echo $e->altitude; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>

        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Is Camera On:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="isOn" id="isOn" value="<?php echo ($e->isOn) ? 'Yes' : 'No'; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera Created On:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" value="<?php echo get_date_time($e->created_on); ?>" name="created" id="created">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Camera Updated On:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" value="<?php echo get_date_time($e->updated_on); ?>" name="updated" id="updated">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4"></div>
            <div class="col text-center border"><img src="api/get_camera_image.php?id=<?php echo $e->camera_id; ?>"/></div>
            <div class="col w-25"></div>
        </div>
    </div>
</body>
</html>
