'use strict';
//                               M O D E L
// Holds the locations of different art galleries in Toronto
var locations = [{
  name: 'Art Gallery of Ontario',
  coordinates: {
    lat: 43.6676695,
    lng: -79.4118322
  }
}, {
  name: 'Royal Ontario Museum',
  coordinates: {
    lat: 43.6684926,
    lng: -79.39403109999999
  }
}, {
  name: 'Design Exchange',
  coordinates: {
    lat: 43.6478141,
    lng: -79.38004959999999
  }
}, {
  name: 'Odon Wagner Gallery & Odon Wagner Contemporary',
  coordinates: {
    lat: 43.6750785,
    lng: -79.3958469
  }
}, {
  name: 'Bau-Xi Gallery',
  coordinates: {
    lat: 43.6542452,
    lng: -79.3927214
  }
}, {
  name: 'Toronto Railway Museum',
  coordinates: {
    lat: 43.6411703,
    lng: -79.3851863
  }
}];

// Create map variable in global scope
var map, infowindow;
// Iniatializes the map. Connects to the maps.googleapis.com script
function initMap() {
    console.log('initMap');
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 43.653226,
        lng: -79.3831843
      }, // Downtown Toronto
      zoom: 13, //Smaller the number, the more zoomed out you are
      mapTypeControl: true
    });

    // Invoke makeMarkers function
    makeMarkers();
    ko.applyBindings(vm);
    vm.addMarkers();
  }

// Setting up googleError to display alert message if map does not load
// Source 2: http://www.w3schools.com/jsref/event_onerror.asp

function googleError() {
  alert('Google Maps cannot load at this time. Please refresh the page or ' +
    'try again later.');
}
var marker;
var markers = [];
var makeMarkers = function() {
    console.log('makeMarkers');
    var location;
    // LatLng
    // Source: https://developers.google.com/maps/documentation/javascript/reference
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < vm.locationObserArray().length; i++) {
      // Store this location item inside a variable
      location = vm.locationObserArray()[i];
      var mapMarker = new google.maps.Marker({
        map: map,
        title: location.name,
        position: location.location,
        // url:     location.url,
        animation: google.maps.Animation.DROP
      });
      mapMarker.addListener('click', markerBounce);
      // Marker Animation
      // Source: https://developers.google.com/maps/documentation/javascript/examples/marker-animations
      function markerBounce() {
        if (mapMarker.getAnimation() !== null) {
          mapMarker.setAnimation(null);
        } else {
          mapMarker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function() {
            mapMarker.setAnimation(null);
          }, 500);
        }
      }

      markers.push(mapMarker);

      mapMarker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
        markerBounce(); // Not working. Why?
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
    infowindow.setContent('<div>Name: ' + mapMarker.title + '</div>\n' +
      '<div> Lat/Lng: ' + mapMarker.position + '</div>');
    // infowindow.setContent('<div>' + mapMarker.position + '</div>');
    infowindow.open(map, mapMarker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.setMarker(null);
    });
  }
}
var LocationItem  = function(place) {
    this.name     = place.name;
    this.location = place.coordinates;
    this.url      = place.url;
    this.currentSelection = ko.observable(true);
  }

//                           V I E W M O D E L

var ViewModel = function() {
  console.log('ViewModel');
  //Reference ViewModel by creating var self
  var self = this;
  //Monitor changes to the Location Observ Array
  self.locationObserArray = ko.observableArray();
  var place;
  for (var i = 0; i < locations.length; i++) {
    // Make new LocationItem with location objects
    place = new LocationItem(locations[i]);
    // Push the new LocationItem to the locationObserArray
    self.locationObserArray.push(place);
  }
  var placeItem;
  var marker;
  /* Links list view to marker when user clicks on the list element */
  self.itemClick = function(placeItem) {
    var marker = placeItem.marker;
    console.log("placeItem: ", placeItem);
    google.maps.event.trigger(marker, 'click');
  };



  // KO will monitor the what the user inputs into the search bar.
  // Value will be bound to the textInput binding and will provide a string for the text Search
  self.searchVenue  = ko.observable('');

  self.filterSearch = ko.computed(function() {
    console.log("search");
    //If the input box is empty, make all location in the list visible

    if (!self.searchVenue() || self.searchVenue === undefined) {
      // Display all markers
      for (var i = 0; i < self.locationObserArray().length; i++) {
        if (self.locationObserArray()[i].marker !== undefined) {
            self.locationObserArray()[i].marker.setVisible(true); // Display the marker
        }
      }
      return self.locationObserArray();
    } else {
      // Avoid case sensitivity : toLowerCase();
      var filter = self.searchVenue().toLowerCase();
      // KO filters out non-matching locations
      // Source: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
      return ko.utils.arrayFilter(self.locationObserArray(), function(
        location) {
        var match = location.name.toLowerCase().indexOf(filter) > -1;
        // Set visibility to true if location matches
        location.marker.setVisible(match);
        // If tue, location goes to filtered array
        return match;
      });
    }
  });


  // Karol. How did you...?
  this.addMarkers = function() {
    this.locationObserArray().forEach(function(place, i) {
      place.marker = markers[i];
    });
  };
}
var vm = new ViewModel();



// __________________________________________________


// var makeInfowindow = function(location) {
//   console.log('location');
//
//   // AJAX request.
//   // Source:
//   var fourSqUrl = 'https://api.foursquare.com/v2/venues/search';
//   var clientId  = 'MHBLFPCXO2YPRPD2U44YYOMTFFCPPHGIFOKXAGW3VABQZM2X';
//   var clientSecret = '4HNIJABEJGAXGUCROWUOTDK3FCITUOEY1EB315H13CZOIPIY';
//
//
//   function getVenues(){
//     console.log('getVenues');
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
