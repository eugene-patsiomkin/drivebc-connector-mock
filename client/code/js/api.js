let geo_objects = [];
let geo_polyline = [];
var geo_points = [];
var my_data = null;
var progress_bar_indicator = 0;
var max_progress_bar_indicator = 0;
let map;
const eventUrl = "https://api.open511.gov.bc.ca/events?format=json";
const cameraUrl = "http://localhost:8080/api/get_camera_image.php?id=";

function ShowPanel()
{
    progress_bar_indicator++;
//    ShowProgressBar();
    if(progress_bar_indicator >= max_progress_bar_indicator)
    {
        $('#progress_bar').addClass('d-none');
        $('#panel1').addClass('d-block').removeClass('d-none');
    }
}

function ShowProgressBar()
{
    var p = 100*progress_bar_indicator/max_progress_bar_indicator;
    $("#progress_bar").css("width", p + "%").text(p + " %");
}

function ShowEventsOnMap(type)
{
    for(var index in my_data.events)
    {
        var event = my_data.events[index];
        if (type.includes(event.event_type))
        {
            if (geo_objects[index] !== null)
            {
                geo_objects[index].setMap(map);
            }
        }
        else
        {
            if (geo_objects[index] !== null) {
                geo_objects[index].setMap(null);
            }
        }
    }
}

function InitEventsOnMap() {
    for (var index in my_data.events) {
        var event = my_data.events[index].geography;
        var points = event.coordinates;
        if (event.type == "LineString") {
            var coords = [];
            for (var i in points) {
                coords.push({ lat: points[i][1], lng: points[i][0] });
            }
            const x = new google.maps.Polyline({
                path: coords,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5,
            });
            x.setMap(map);
            geo_objects.push(x);
        }
        else if (event.type == "Point") {
            var coords = [{ lat: points[1], lng: points[0] }, { lat: points[1], lng: points[0] }];
            const x = new google.maps.Polyline({
                path: coords,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5,
            });
            x.setMap(map);
            geo_objects.push(x);
        }
        else {
            geo_objects.push(null);
        }
    }
}

function UpdateField(id,val)
{
    $(id).val(val);
}

function GetDate(d)
{
    var date = new Date(d);
    return date.toString();
}

function ShowEvents(d,n)
{
    if (d.geometry.type == "Point") {
        var p = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
        const contentString ='<div style="width: 450px;">'+
                                '<p>'+d.properties.type.severity.charAt(0)+d.properties.type.severity.slice(1).toLowerCase()+' Event</p>'+
                                '<p>Active: '+((d.properties.type.active) ? "Yes" : "No")+'</p>'+
                                '<p>Planned: '+((d.properties.type.planned) ? "Yes" : "No")+'</p>'+
                                '<p>Event ID: ' + d.properties.bid + '</p>'+
                                '<p>Headline: ' + d.properties.info.headline + '</p>'+
                                '<p>Start Time: ' + GetDate(d.properties.schedule[0].start) + '</p>'+
                                '<p>End Time: ' + GetDate(d.properties.schedule[0].end) + '</p>'+
                                '<p>Description: ' + d.properties.info.description + '</p>'+
                            '</div>';
                            //name.charAt(0).toUpperCase() + name.slice(1)
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
        var marker = new google.maps.Marker({
            position: p,
            title: d.properties.info.description,
            icon: ((d.properties.type.severity == 'MAJOR') ? "../images/Incident_major.png" : "../images/incident.png")
        });
        marker.setMap(map);        
        marker.addListener("mouseover", () => {
            infowindow.open(map, marker);
        });
    }
    $('#profile_event_links').append('<p style="line-height: 12pt;">'+(parseInt(n)+1)+'. <a target="_blank" href="event_page.php?id='+ d.properties.bid+'">'+d.properties.info.description.substr(0,70)+'...</a></p>');
//    $('#profile_event_links').append('<p style="line-height: 12pt;">'+parseInt(n+2)+'. '+d.properties.info.description.substr(0,70)+'...</p>');
//    $('#profile_event_links').append('<p style="line-height: 12pt;">'+parseInt(n+3)+'. '+d.properties.info.description.substr(0,70)+'...</p>');
}

function ShowCamera(d)
{
    if (d.geometry.type == "Point") {
        var p = new google.maps.LatLng(d.geometry.coordinates[1], d.geometry.coordinates[0]);
        const contentString ='<div style="width: 250px;">'+
                                '<button type="button" class="btn btn-outline-primary btn-sm float-right">Add to My Webcams</button>'+
                                '<img class="mt-2" src="'+cameraUrl+d.camera_id+'" width="250"/>'+
                                '<p>'+d.name+': '+d.orientation+'</p>'+
                                '<p>'+d.caption+'</p>'+
                                '<button type="button" class="btn btn-outline-primary btn-sm ml-4">Replay the Day</button>'+
                                '<button type="button" class="btn btn-outline-primary btn-sm ml-2">Weather</button>'+
                            '</div>';
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
        
        var marker = new google.maps.Marker({
            position: p,
            title: d.caption,
            icon: "../images/cam_e.png"
        });
        marker.setMap(map);        
        marker.addListener("mouseover", () => {
            infowindow.open(map, marker);
        });
    }
}

function ShowGeofence(d)
{
    if (d.type == "Polygon") {
        var p = [];
        var c = d.coordinates[0];
        for(var i in c)
        {
            p.push(new google.maps.LatLng(c[i][1], c[i][0]));
        }
        
        var area = new google.maps.Polygon({
            paths: p,
            strokeColor: "#ff0000",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillColor: "#800000",
            fillOpacity: 0.10,
          });        
        area.setMap(map);        
    }
}

function ShowProfile()
{
    var r_index = 0;
    if(typeof my_data.favorites.routes != "undefined")
    {
        max_progress_bar_indicator=0;
        if(my_data.favorites.routes.length > 0)
        {
            max_progress_bar_indicator+=3
            UpdateField('#inputAddress1',my_data.favorites.routes[r_index].start);
            UpdateField('#inputAddress2',my_data.favorites.routes[r_index].end);
            $.getJSON("api/get_geofence_events.php?id="+my_data.favorites.routes[r_index].geofence_id, function (data, status) {
                for(var i in data.features)
                {
                    ShowEvents(data.features[i], i);
                }
                ShowPanel();
            });
            $.getJSON("api/get_geofence.php?id="+my_data.favorites.routes[r_index].geofence_id, function (data, status) {
                ShowGeofence(data.geometry);
                ShowPanel();
            });
            $.getJSON("api/get_geofence_cameras.php?id="+my_data.favorites.routes[r_index].geofence_id, function (data, status) {
                for(var i in data)
                {
                    ShowCamera(data[i]);
                    //$('#profile_pictures_id').prepend('<p style="line-height: 12pt;text-align:center;">'+data[i].caption+'</p><div class="input-group"><img src="'+cameraUrl+data[i].camera_id+'" class="img-fluid"/></div><br>');
                    $('#profile_pictures_id').append('<p style="line-height: 12pt;text-align:center;">'+data[i].caption+'</p><div class="text-center"><a target="_blank" href="camera_page.php?id='+ data[i].camera_id +'"><img src="'+cameraUrl+data[i].camera_id+'" height="180px"/></a></div><br>');
                }
                ShowPanel();
                //                ShowGeofence(data.geometry);
            });
        }
        if(my_data.favorites.cameras.length > 0)
        {
            var cam = my_data.favorites.cameras;
            for (var i in cam) {
                $('#profile_fav_cam_id').prepend('<p style="line-height: 12pt;text-align:center;">'+cam[i].caption+'</p><div class="text-center border"><a target="_blank" href="camera_page.php?id='+ cam[i].camera_id +'"><img src="'+cameraUrl+cam[i].camera_id+'" height="180px"/></div><br>');
            }
        }
        ShowPanel();
    }
}
//$(this).attr("src", "images/card-front.jpg");

function LoadProfile()
{
    $.getJSON("http://localhost:8080/api/get_profile.php", function (data, status) {
        my_data = data;
        ShowProfile();
    });
}

/*
To get events in geofence:
It can return events as json or geojson depends on accept header
application/json - json
application/geo+json - geojson

Headers:

Accept: application/geo+json
apikey: drivebc-api-key

Method:

GET    

URL:

http://localhost:8000/api/events/v1/events?geofence=demo-geofence-2


*/

function getEvents()
{
    LoadProfile();
    //my_data = file_data;
    //InitEventsOnMap();
}
// Initialize and add the map
function initMap() {
    //-122.723534, 49.192245
    // The location of Uluru
    const initLocation = { lat: 49.13698654304583, lng: -120.61947355901661 };
    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: initLocation,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
        },
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
        },
    });
    getEvents();
}

function GetEventsOptions()
{
    var filter = [];
    if ($('#incident').prop('checked'))
    {
        filter.push('INCIDENT');
    }
    if ($('#roadCondition').prop('checked')) {
        filter.push('ROAD_CONDITION');
    }
    if ($('#construction').prop('checked')) {
        filter.push('CONSTRUCTION');
    }

    ShowEventsOnMap(filter);
    //alert('incident: ' + $('#incident').prop('checked') + '\nRoad Condition: ' + $('#roadCondition').prop('checked'));

    //$('#incident').change(function () {
    //    alert($(this).prop('checked'))
    //})

    //roadCondition
    //incident
}

$(document).ready(function () {
    $('#incident').change(function () {
        GetEventsOptions();
    })
    $('#roadCondition').change(function () {
        GetEventsOptions();
    })
    $('#construction').change(function () {
        GetEventsOptions();
    })
    //getEvents();
});