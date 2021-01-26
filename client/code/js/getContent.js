var request = new XMLHttpRequest();
var url = "http://localhost:8000/api/cms/v1/ghost/api/v3/content/posts/slug/daily-commuter/?apikey=cms-api-key&key=7c06d112f7453ec8871b62179a"
request.open('GET', url, true);

request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = JSON.parse(this.response);
        document.getElementById("news-commuter").innerHTML =  `<h4>${resp.posts[0].title}</h4>${resp.posts[0].html}`;
    } else {
        // We reached our target server, but it returned an error
        console.log("5000000000000000", this);
    }
};

request.onerror = function () {
    console.log("Errrrrrrrrrrrrrrrrrrrrrrrrorrrrrrrrrrrrr")
    // There was a connection error of some sort
};

request.send();

var request1 = new XMLHttpRequest();
var url1 = "http://localhost:8000/api/cms/v1/ghost/api/v3/content/posts/slug/commercial-drive/?apikey=cms-api-key&key=7c06d112f7453ec8871b62179a"
request1.open('GET', url1, true);

request1.onload = function () {
    if (this.status >= 200 && this.status < 400) {
        // Success!
        var resp = JSON.parse(this.response);
        document.getElementById("news-commercial").innerHTML =  `<h4>${resp.posts[0].title}</h4>${resp.posts[0].html}`;
    } else {
        // We reached our target server, but it returned an error
        console.log("5000000000000000", this);
    }
};

request1.onerror = function () {
    console.log("Errrrrrrrrrrrrrrrrrrrrrrrrorrrrrrrrrrrrr")
};

request1.send();

