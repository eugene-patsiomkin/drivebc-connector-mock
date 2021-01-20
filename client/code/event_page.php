<?php
    require('api/tools.php');

    $d = get_event_by_id($_GET['id']);
    if($d->error)
    {
        echo $d->error_msg;
        die();
    }
    $e = json_decode($d->data);
    //var_dump($e);
    //die();
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
                <div class="form pt-2 text-center"><h1>Event Info</h1></div>
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event ID:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="event_id" id="event_id" value="<?php echo $e->properties->bid; ?>">
            </div>
            <div class="col w-25">
                <div class="form text-danger pt-2">*</div>
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Tags:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="etags" id="etags" value="<?php echo implode(",",$e->properties->type->tags); ?>">
            </div>
            <div class="col w-25">
                <div class="form text-danger pt-2">*</div>
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Severity:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="severity" id="severity" value="<?php echo $e->properties->type->severity; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Is Event Active:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="active" id="active" value="<?php echo ($e->properties->type->active) ? 'Yes' : 'No'; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Is Event Planned:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" name="planned" id="planned" value="<?php echo ($e->properties->type->planned) ? 'Yes' : 'No'; ?>">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Schedule:</span></div>
            </div>
            <div class="col">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Start</th>
                            <th>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                            $i = 1;
                            foreach($e->properties->schedule as $val)
                            {
                                echo "<tr><td>".$i."</td><td>".get_date_time($val->start)."</td><td>".get_date_time($val->end)."</td></tr>";
                                $i++;
                            }
                        ?>
                    </tbody>
                </table>
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Headline:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" value="<?php echo $e->properties->info->headline; ?>" name="headline" id="headline">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Description:</span></div>
            </div>
            <div class="col">
                <div class="border"><?php echo $e->properties->info->description; ?></div>
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Created On:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" value="<?php echo get_date_time($e->properties->created_on); ?>" name="created" id="created">
            </div>
            <div class="col w-25">
            </div>
        </div>
        <div class="row form-row mt-2">
            <div class="col-4">
                <div class="form float-right pt-2"><span>Event Updated On:</span></div>
            </div>
            <div class="col">
                <input type="text" class="form-control" value="<?php echo get_date_time($e->properties->updated_on); ?>" name="updated" id="updated">
            </div>
            <div class="col w-25">
            </div>
        </div>
    </div>
</body>
</html>
