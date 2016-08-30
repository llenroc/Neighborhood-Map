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
var map, infowindow;

// Iniatializes the map. Connects to the maps.googleapis.com script
function initMap() {
  console.log("initMap");

  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.653226, lng: -79.3831843}, // Downtown Toronto
    zoom: 13,   //Smaller the number, the more zoomed out you are
    mapTypeControl: true
  });

  infowindow = new google.maps.InfoWindow({
    maxWidth: 200
  });

  // Invoke makeMarkers function
  makeMarkers();

  ko.applyBindings(vm);

}
// Setting up googleError to display alert message if map does not load
// Source 1: https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282?_ga=1.41498853.695421812.1465078182
// Source 2: http://www.w3schools.com/jsref/event_onerror.asp

function googleError() {
  alert("Google Maps cannot load at this time. Please refresh the page or "
  + "try again later.");

}

var markers = [];

var makeMarkers = function(){
  console.log("makeMarkers");

  var location;
  // LatLng
  // Source: https://developers.google.com/maps/documentation/javascript/reference
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();


  for (var i = 0; i < vm.locationObserArray().length; i++){

    // Store this location item inside a variable
    location = vm.locationObserArray()[i];

    var mapMarker = new google.maps.Marker({
      map: map,
      position: location.location,
      title: location.name,
      animation: google.maps.Animation.DROP,

    });

    markers.push(mapMarker);

    mapMarker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow)
    });
    bounds.extend(markers[i].position);

  }
  map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
// Source /_Google Maps API folder: https://classroom.udacity.com/courses/ud864/lessons/8304370457/concepts/83122494450923#

function populateInfoWindow(mapMarker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.mapMarker != mapMarker) {
    infowindow.mapMarker = mapMarker;
    infowindow.setContent('<div>Name: ' + mapMarker.title + '</div>\n'
    + '<div> Lat/Lng: ' + mapMarker.position + '</div>');
    // infowindow.setContent('<div>' + mapMarker.position + '</div>');
    infowindow.open(map, mapMarker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick',function(){
      infowindow.setMarker(null);
    });
  }
}

// Marker Animation
// Source: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
function markerBounce(location){
  if (location.marker.getAnimation() !== null){
    location.marker.setAnimation(null);
  }
  else {
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      location.marker.setAnimation(null);
    }, 500);
  }

}

// var makeInfowindow = function(location) {
//   console.log("location");
//
//   // AJAX request.
//   // Source:
//   var fourSqUrl = 'https://api.foursquare.com/v2/venues/search';
//   var clientId  = 'MHBLFPCXO2YPRPD2U44YYOMTFFCPPHGIFOKXAGW3VABQZM2X';
//   var clientSecret = '4HNIJABEJGAXGUCROWUOTDK3FCITUOEY1EB315H13CZOIPIY';
//
//
//
//
//   function getVenues(){
//     console.log("getVenues");
//     $.ajax({
//
//       url: fourSqUrl,
//       dataType: 'json',
//       data: {
//         ll: '43.653226, -79.3831843', // Downtown Toronto
//         clientId: clientId,
//         clientSecret: clientSecret,
//         v: 20161231,
//         m: 'foursquare',
//         query: location.name,
//         limit: 10
//       },
//       async: true,
//
//       // If Foursquare ajax request is successful...
//       success: function(result){
//
//         var venue = result.response.venues[0];
//         var address = venue.location.address;
//
//         // console.log(venue);
//         // console.log(address);
//
//         if (venue === null) {
//           var infoWindowContent = '<div>' + location.name + '</div>' +
//           '<div>' + location.info + '</div>' + ': NO ADDRESS DATA AVAILABLE.';
//         } else {
//           var infoWindowContent = '<div>' + location.name + '</div>' +
//           location.info + '<div>' + address + '</div>';
//         }
//
//         // Populates content of window with the following:
//         infowindow.setContent(infoWindowContent);
//         infowindow.open(map, location.marker);
//
//       },
//       //If request fails...
//       error: function(){
//         alert('Request unsuccessful.');
//       }
//
//     });
//   }
//   getVenues();
// }




var LocationItem = function(place) {

  this.name     = place.name;
  this.location = place.coordinates;
  this.info     = place.info;
  this.currentSelection = ko.observable(true);
}

//                           V I E W M O D E L

var ViewModel = function (){
  console.log("ViewModel");
  //Reference ViewModel by creating var self
  var self = this;

  //Monitor changes to the Location Observ Array
  self.locationObserArray = ko.observableArray();

  var place;

  for (var i = 0; i < locations.length; i++){

    // Make new LocationItem with location objects
    place = new LocationItem(locations[i]);

    // Push the new LocationItem to the locationObserArray
    self.locationObserArray.push(place);

  }
  self.listItemClick = function(marker){
    google.maps.event.trigger(this.marker, 'click');
  }

}

var vm = new ViewModel();


/*

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


}

*/



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
