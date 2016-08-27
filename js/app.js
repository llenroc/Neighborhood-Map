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

  // We need the markers for the designated galleries to show up on the map.
  // Use for loop to iterate over the var location items
  // To optimize loop speed (remember web optimization project),
  // variables kept outside the loop.

  // Loop structure from

  var marker;   // Creates the marker
  var position; // Will hold the position from the location array

  var i = 0;
  var localLength = locations.length;

  for (i = 0; i < localLength; i++){

    var position = locations[i].coordinates;
    var gallery = locations[i].name;

    marker = new google.maps.Marker({

      map: map,
      position: position,
      title: name,
      animation: google.maps.Animation.DROP,
    });


  }

}

// Setting up googleError to display alert message if map does not load
// Source 1: https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282?_ga=1.41498853.695421812.1465078182
// Source 2: http://www.w3schools.com/jsref/event_onerror.asp

function googleError() {
  alert("Google Maps cannot load at this time. Please refresh the page or "
  + "try again later.");

}


// Set up each gallery location as an item
// Source: https://discussions.udacity.com/t/having-trouble-accessing-data-outside-an-ajax-request/39072/11?u=david_31931020565290
var galleryLocation = function(data){
  var self = this;

  self.name    = ko.observable(data.name);
  self.address = ko.observable(data.address);
  self.latLng  = ko.observable(new google.maps.LatLng(data.lat, data.lng));

}


//                           V I E W M O D E L

// Goal: Create infowindow w/ address + IG photos


var ViewModel = function() {

  // Making `this` accessible within the function. Self represents ViewModel
  // Source: https://www.udacity.com/course/viewer#!/c-ud989-nd/l-3406489055/m-3464818691
  var self = this;

  // Array will hold list of different galleries
  // Source: https://www.udacity.com/course/viewer#!/c-ud989-nd/l-3406489055/e-3464818693/m-3464818694


  // Creating infowindow for markers.
  var infowindow = new google.maps.InfoWindow({
    maxWidth: 300
  });

}
