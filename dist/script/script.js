
var netflixAPI="http://unlo.it/4a972e5d0c7cbfa";


var xhr = new XMLHttpRequest();
xhr.onload = function() {
  console.log(xhr.responseXML.documentElement.nodeName);
}
xhr.onerror = function() {
  dump("Error while getting XML.");
}

function onSelectChange(val) {
    //call netflix API
    xhr.open("GET", netflixAPI+"?country="+val+"&channel=netflix");
	xhr.responseType = "document";
	xhr.send();
}

