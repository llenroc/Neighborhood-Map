'use strict';

//                               M O D E L

// Holds the locations of different art galleries in Toronto
var locations = [
    {
        name: 'Art Gallery of Ontario',
        coordinates:{lat: 43.6676695, lng: -79.4118322}
    },
    {
        name: 'Royal Ontario Museum',
        coordinates:{lat: 43.6684926, lng: -79.39403109999999}
    },
    {
        name: 'Design Exchange',
        coordinates:{lat: 43.6478141, lng: -79.38004959999999}
    },
    {
        name: 'Odon Wagner Gallery & Odon Wagner Contemporary',
        coordinates:{lat: 43.6750785, lng: -79.3958469}
    },
    {
        name: 'Bau-Xi Gallery',
        coordinates:{lat: 43.6542452, lng: -79.3927214}
    },
    {
        name: 'Toronto Railway Museum',
        coordinates:{lat: 43.6411703, lng: -79.3851863}
    }
];


// Create map variable in global scope
var map;
// Iniatializes the map. Connects to the maps.googleapis.com script
function initMap() {

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.653226, lng: -79.3831843}, // Downtown Toronto
    zoom: 13,   //Smaller the number, the more zoomed out you are
    mapTypeControl: false
  });


}
// Setting up googleError to display alert message if map does not load
// Source 1: https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282?_ga=1.41498853.695421812.1465078182
// Source 2: http://www.w3schools.com/jsref/event_onerror.asp

function googleError() {
  alert("Google Maps cannot load at this time. Please refresh the page or "
  + "try again later.");

}

// Observables
// Source: https://discussions.udacity.com/t/having-trouble-accessing-data-outside-an-ajax-request/39072/11?u=david_31931020565290
var Place = function (data){

  this.name    = ko.observable(data.name);
  this.address = ko.observable(data.address);
  this.lat     = ko.observable(data.lat);
  this.lng     = ko.observable(data.lng);
  this.url     = ko.observable(data.url);
  this.rating  = ko.observable(data.rating);
  this.marker  = ko.observable();

}


//                           V I E W M O D E L

// Goal: Create infowindow w/ address + IG photos


var ViewModel = function() {
  // Making `this` accessible within the function. Self represents ViewModel
  // Source: https://www.udacity.com/course/viewer#!/c-ud989-nd/l-3406489055/m-3464818691
  var self = this;

  // Creating infowindows for markers.
  var infowindow = new google.maps.InfoWindow();

  // Call the Place constructor above and create Place objects for each
  // item in locations and push them into the placeList below
  // Source: https://www.udacity.com/course/viewer#!/c-ud989-nd/l-3406489055/e-3464818693/m-3464818694
  locations.forEach(function (placeObject) {
    // Avoid confusion by using self, which refers to the ViewModel
    // This ends up mapping to the placeList observableArray
    self.placeList.push(new Place (placeObject) );
  });

  // An array of all art galleries
  // Source: https://www.udacity.com/course/viewer#!/c-ud989-nd/l-3406489055/e-3464818693/m-3464818694
  this.placeList = ko.observableArray([]);

  var marker;   // Iniatilize marker
  var position; // Initialize position for the location array

  self.placeList().forEach(function(placeObject){

    marker = new google.maps.Marker({
      map: map,
      position: new google.maps.LatLng(placeObject.lat(), placeObject.lng()),
      title: name,
      animation: google.maps.Animation.DROP
    });
    placeObject.marker = marker;

    // FourSquare API
      // Source:          https://developer.foursquare.com/docs/venues/explore
      // Intent:           https://developer.foursquare.com/docs/venues/search
      // Versioning:      https://developer.foursquare.com/overview/versioning
    var fourSqUrl = 'https://api.foursquare.com/v2/venues/explore?limit=1&ll=' + placeObject.lat() + ', ' + placeObject.lng() + '&intent=match&query=' + placeObject.name() + '&client_id=MHBLFPCXO2YPRPD2U44YYOMTFFCPPHGIFOKXAGW3VABQZM2X&client_secret=4HNIJABEJGAXGUCROWUOTDK3FCITUOEY1EB315H13CZOIPIY&v=20161231';

    // Retrieve specific FourSquare data and send it to the browser.
    // Observables should not be in getJSON call.
    // Source: https://www.youtube.com/watch?v=3hN4PrJ7R6A
    // .error Source: https://stackoverflow.com/questions/1740218/error-handling-in-getjson-calls
    var venue, name, address, rating, url;

    $.getJSON (fourSqUrl, function(data){
      venue =  data.response.venues;
      placeObject.name    = venue.name;
      placeObject.address = venue.address;
      placeObject.rating  = venue.rating;
      placeObject.url     = venue.url;
    })
    .error(function (fail){
      document.getElementById('markerFail').innerHTML = 'Could not retrieve data' +' on the location. Please try again.';

    });

    // Show venue location when the marker is clicked
    google.maps.event.addListener(placeObject.marker, 'click', function (){
      setTimeout(function(){
        infowindow.setContent('<h2>' + placeObject.name + '</h2>'
        + '\n<p> Address:' + placeObject.address + '</p>'
        + '\n<p> Rating: ' + placeObject.rating  + '</p>'
        + '\n<p> Website:' + placeObject.url     + '</p>')
        infowindow.open(map,placeObject.marker);
      }, 150); //


    });

  });

  // self.venue_info = function(placeObject){
  //   google.maps.event.trigger(placeObject.marker, 'click');
  // };

}





// Yelp Developers Authentication. OAuth too complicated.
// Source: https://discussions.udacity.com/t/how-to-make-ajax-request-to-yelp-api/13699/5?u=david_31931020565290


// We need the markers for the designated galleries to show up on the map.
// Use for loop to iterate over the var location items
// To optimize loop speed (remember web optimization project),
// variables kept outside the loop.

// var i;
// var localLength = locations.length;

// for (i = 0; i < localLength; i++){
//
//   var position = locations[i].coordinates;
//   var gallery = locations[i].name;
//
//   // Define marker
//   marker = new google.maps.Marker({
//     map: map,
//     position: position,
//     title: name,
//     animation: google.maps.Animation.DROP,
//   });
//   galleryItem.marker = marker;
