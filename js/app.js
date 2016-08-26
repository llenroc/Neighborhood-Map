'use strict';

//                               M O D E L

//Hold the locations of different art galleries
var locations = [
    {
        name: "Art Gallery of Ontario",
        lat: 43.6676695,
        lng: -79.4118322
    },
    {
        name: "Royal Ontario Museum",
        lat: 43.6684926,
        lng: -79.39403109999999
    },
    {
        name: "Design Exchange",
        lat: 43.6478141,
        lng: -79.38004959999999
    },
    {
        name: "Odon Wagner Gallery & Odon Wagner Contemporary",
        lat: 43.6750785,
        lng: -79.3958469

    },
    {
        name: "Bau-Xi Gallery",
        lat: 43.6542452,
        lng: -79.3927214
    },
    {
        name: "Toronto Railway Museum",
        lat: 43.6411703,
        lng: -79.3851863
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

//                           V I E W M O D E L




//                                V I E W
