// This list contains the 5 places wich I initially chose to be displayed
// on the map
var geekyPlaces = [
  {
    name: 'Eide\'s Entertainment',
    address: '1121 Penn Ave, Pittsburgh, PA 15222, USA',
    category: 'Comic Book Shop'
  },
  {
    name: 'New Dimension Comics',
    address: '3075 Clairton Rd #940, West Mifflin, PA 15123, USA',
    category: 'Comic Book Shop'
  },
  {
    name: 'Geekadrome',
    address: '534 Brookline Blvd, Pittsburgh, PA 15226, USA',
    category: 'Comic Book Shop'
  },
  {
    name: 'Geek Dot Jewelry',
    address: '3453 Butler Street, Lawrenceville, PA 15201, USA',
    category: 'Jewelry Shop'
  },
  {
    name: 'Carnegie Science Center',
    address: '1 Allegheny Ave, Pittsburgh, PA 15212, USA',
    category: 'Science Museum'
  },
  {
    name: 'Steel City Con',
    address: '209 Mall Plaza Blvd, Monroeville, PA 15146, USA',
    category: 'Comic Con'
  },
  {
    name: '3 RIVERS COMICON',
    address: '3075 Old Clairton Rd., West Mifflin, PA 15123, USA',
    category: 'Comic Con'
  },
  {
    name: 'Victory Pointe Arcade and Gaming Cafe',
    address: '1113 E Carson St, Pittsburgh, PA 15203, USA',
    category: 'Cafè and Gambling Hall'
  },
  {
    name: 'Games N\' At',
    address: '2010 Josephine St, Pittsburgh, PA 15203, USA',
    category: 'Cafè and Gambling Hall'
  },
  {
    name: 'Kickback Pinball Cafe',
    address: '4326 Butler St, Pittsburgh, PA 15201, USA',
    category: 'Cafè and Gambling Hall'
  }
];

// This is the ViewModel of my project
var myViewModel = function() {
    var self = this;

    // Create a Knockout observable Array for all the geeky places
    this.geekPlaceList = ko.observableArray([]);

    // Add each geeky place listed in the inital list to the observable Array
    geekyPlaces.forEach(function(geekyPlace) {
      self.geekPlaceList.push( new GeekPlace(geekyPlace));
    });

    // Sort the array of geeky Places alphabetically based on the name
    function myCompareFunction(a,b){
      if (a.name() < b.name()){
        return -1;
      } else if (a.name() > b.name()) {
        return 1;
      } else {
        return 0;
      }
    }

    this.geekPlaceList().sort(myCompareFunction);

    // Set the current place to be the first item in the observable Array
    this.currentPlace = ko.observable(this.geekPlaceList()[0]);

    // Function to select a place from the list
    this.setSelectedPlace = function () {
      console.log("I am here");
    };

};

// This is the Model (data) of my project
var GeekPlace = function(geekyPlace) {
  this.name = ko.observable(geekyPlace.name);
  this.address = ko.observable(geekyPlace.address);
  this.category = ko.observable(geekyPlace.category);
}

// Apply the Bindings
ko.applyBindings(new myViewModel());

// Create the Google Map and centralize it over Pittsburgh, PA
var map;
var geocoder;
var markers = [];

function initMap() {
    var styles =
    [
      {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "color": "#e0efef"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "hue": "#1900ff"
              },
              {
                  "color": "#c0e8e8"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
              {
                  "lightness": 100
              },
              {
                  "visibility": "simplified"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "on"
              },
              {
                  "lightness": 700
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "all",
          "stylers": [
              {
                  "color": "#7dcdcd"
              }
          ]
      }
  ]
  console.log("Create Initial Map");
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 40.440625, lng: -79.995886},
     styles: styles,
     zoom: 13
   });

   // Add a large info window which shows details of the location
   var largeInfowindow = new google.maps.InfoWindow();

   // Use the Google Maps Geocoding API to allocate the addresses to
   // lat and long values
   geocoder = new google.maps.Geocoder();

   // Iterate through the list and assingn a marker to each place
   geekyPlaces.forEach(function(geekyPlace) {
     var address = geekyPlace.address;
     var name = geekyPlace.name;
     var category = geekyPlace.category;

     geocoder.geocode( {'address': address}, function(results, status) {
       if (status == 'OK') {
         var marker = new google.maps.Marker({
           position: results[0].geometry.location,
           title: name,
           animation: google.maps.Animation.DROP,
           id: geekyPlace
         });

         markers.push(marker);
         marker.addListener('click', function() {
           populateInfoWindow(this, largeInfowindow, address, category);
         });
       }

       // Place the marker on the map and make sure the boundaries fit
       var bounds = new google.maps.LatLngBounds();
       for (var i = 0; i < markers.length; i++) {
         if (markers[i].id.category == "Comic Book Shop") {
           markers[i].setIcon(makeMarkerIcon('f9e425'));
         } else if (markers[i].id.category == "Jewelry Shop") {
          markers[i].setIcon(makeMarkerIcon('2b5dad'));
        } else if (markers[i].id.category == "Science Museum") {
          markers[i].setIcon(makeMarkerIcon('ad2b74'));
         } else if (markers[i].id.category == "Comic Con") {
          markers[i].setIcon(makeMarkerIcon('3b895e'));
         } else if (markers[i].id.category == "Cafè and Gambling Hall") {
          markers[i].setIcon(makeMarkerIcon('ba2121'));
         }
         markers[i].setMap(map);
         bounds.extend(markers[i].position);
       }
       map.fitBounds(bounds);
     });

   });
}

// Create the infowindow and add the name, category and address
function populateInfoWindow(marker, infowindow, address, category) {
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div><p>' + marker.title + ' -- ' + category + '</p><p>' + address + '</p></div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 25 px wide by 46 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(25, 46),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(25, 46));
  return markerImage;
}

document.getElementById('show-listings-all').addEventListener('click', showAllListings);
document.getElementById('show-listings-cafe').addEventListener('click', function() {
  showListings("Cafè and Gambling Hall");
  }, false);
document.getElementById('show-listings-comic-book').addEventListener('click', function() {
  showListings("Comic Book Shop");
  }, false);
document.getElementById('show-listings-comic-con').addEventListener('click', function() {
  showListings("Comic Con");
  }, false);
document.getElementById('show-listings-jewelry').addEventListener('click', function() {
  showListings("Jewelry Shop");
  }, false);
document.getElementById('show-listings-science').addEventListener('click', function() {
  showListings("Science Museum");
  }, false);

// This function will loop through the markers array and display
// only those that are from a certain category
function showListings(category) {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].id.category == category) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    } else {
      markers[i].setMap(null);
    }
  }
  map.fitBounds(bounds);
}

// This function will loop through the markers array and display them all.
function showAllListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
