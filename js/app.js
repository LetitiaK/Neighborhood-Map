///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// This list contains the 5 places wich I initially chose to be displayed
// on the map
var geekyPlaces = [
  {
    name: 'Eide\'s Entertainment',
    address: '1121 Penn Ave, Pittsburgh, PA 15222, USA',
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
    name: 'Hot Haute Hot',
    address: '2124 Penn Ave, Pittsburgh, PA 15222, USA',
    category: 'Jewelry Shop'
  },
  {
    name: 'Carnegie Science Center',
    address: '1 Allegheny Ave, Pittsburgh, PA 15212, USA',
    category: 'Museum'
  },
  {
    name: 'ToonSeum',
    address: '945 Liberty Ave, Pittsburgh, PA 15222, USA',
    category: 'Museum'
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

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// This is the ViewModel of my project
var myViewModel = function() {
    var self = this;

    // Determine whether the side menu ought to be shown or not
    // This is important for usability on smaller devices
    this.showSideMenu = ko.observable(false);
    this.closeMenu = function() {
      if (this.showSideMenu()) {
        this.showSideMenu(false);
      } else {
        this.showSideMenu(true);
        // Resize the map in order to prevent grey side bar
        google.maps.event.trigger(map, 'resize');
      }
    }

     // This knockout observable is used to toggle the list of all places
     this.showPlaceList = ko.observable(false);
     // If the knockout observable is true, the list is shown
     // else, the list is hidden
     this.closeList = function() {
       showAllListings(markers);
       if (this.showPlaceList()) {
         this.showPlaceList(false);
       } else {
         this.showPlaceList(true);
       }
     }

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
    // If the place is selected the infowindow is opened over the place
    this.setSelectedPlace = function () {
      name = this.name();
      var result = markers.filter(function(marker) {
        return marker.title == name;
      });
      var position = result[0].position;
      var address = result[0].id.address;
      var category = result[0].id.category;
      showListings(name, "name");
      createInfoWindowFromList(this, position, address, category);
      createTwitterFeed(this.name());
      getFoursquare(position, this.name());
    };

    this.placeSearch = ko.observable("");

};

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// This is the Model (data) of my project
var GeekPlace = function(geekyPlace) {
  this.name = ko.observable(geekyPlace.name);
  this.address = ko.observable(geekyPlace.address);
  this.category = ko.observable(geekyPlace.category);
  this.visible = ko.observable(true);
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var vm = new myViewModel();

// Compute the places which fit to the given filter, i.e.
// the user input in the search bar
myViewModel.prototype.filterPlaces = ko.computed(function () {
    var filteredPlaces = ko.observableArray([]);
    var filteredMarkers = ko.observableArray([]);
    var self = this;
    var filter = self.placeSearch().toLowerCase();
    if (filter) {
      return ko.utils.arrayFilter(self.geekPlaceList(), function(geekyPlace) {
        var string = geekyPlace.name().toLowerCase();
        var result = (string.search(filter) >= 0);
        geekyPlace.visible(result);
        // If the result is true push this place to the filteredPlaces array
        if (result) {
          filteredPlaces.push(geekyPlace);
        }
        // Push those markers to the filteredMarkers array that have a result
        // of true, i.e. that include the given filter
        for (var i = 0; i < filteredPlaces().length; i++) {
          for (var j = 0; j < markers.length; j++) {
            if (filteredPlaces()[i].name() == markers[j].title) {
              if (filteredMarkers.indexOf(markers[j]) < 0) {
                filteredMarkers.push(markers[j]);
              }
            }
          }
          // Call the function showAllListings to show only those markers
          // for which the filter is true
          showAllListings(filteredMarkers);
        }
        return result;
      });
    }
}, vm);

// Apply the Bindings
ko.applyBindings(vm);

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

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
           createTwitterFeed(this.title);
           getFoursquare(this.position, this.title);
         });
       } else {
         console.log("There was a problem");
         console.log(status);
         alert("Not all markers could be loaded correctly. \
         Perhabs you have reached the limit of possible markers per day.")
       }

       // Place the markers on the map and make sure the boundaries fit
       // Determine the color of the marker based on the category
       var bounds = new google.maps.LatLngBounds();
       for (var i = 0; i < markers.length; i++) {
         if (markers[i].id.category == "Comic Book Shop") {
           markers[i].setIcon(makeMarkerIcon('f9e425'));
         } else if (markers[i].id.category == "Jewelry Shop") {
          markers[i].setIcon(makeMarkerIcon('2b5dad'));
        } else if (markers[i].id.category == "Museum") {
          markers[i].setIcon(makeMarkerIcon('f442e5'));
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

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var infowindow = null;
// Function to open an infowindow by clicking on the entry in the list
function createInfoWindowFromList(marker, position, address, category) {
  // If there is already an infowindow open from another location
  // it is closed automatically, so that there is always only one
  // InfoWindow open
   if (infowindow) {
     infowindow.close();
   }
   img = getGoogleStreetView(address);
   infowindow = new google.maps.InfoWindow();
   if (infowindow.marker != marker) {
     infowindow.marker = marker;
     infowindow.setContent('<div><p>' + marker.name() + ' -- ' + category +
                           '</p><p>' + address + '<br><br>' + img + '</p><p>Scroll down for more information!</p></div>');
     infowindow.setPosition(position);
     infowindow.open(map);
     infowindow.addListener('closeclick', function() {
     infowindow.marker = null;
     });
   }
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Create the infowindow and add the name, category and address
function populateInfoWindow(marker, infowindow, address, category) {
  img = getGoogleStreetView(address);
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div><p>' + marker.title + ' -- ' + category +
                          '</p><p>' + address + '<br><br>' + img + '</p><p>Scroll down for more information!</p></div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
    infowindow.marker = null;
    });
  }
}

function getGoogleStreetView(address) {
  var $url = 'http://maps.googleapis.com/maps/api/streetview?size=250x150&location='+ address;
  var img = ["<img src=' " + $url + " '>"];
  return img;
}
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

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

document.getElementById('show-listings-all').addEventListener('click', function() {
  showAllListings(markers);
}, false);
document.getElementById('show-listings-cafe').addEventListener('click', function() {
  showListings("Cafè and Gambling Hall", "category");
  }, false);
document.getElementById('show-listings-comic-book').addEventListener('click', function() {
  showListings("Comic Book Shop", "category");
  }, false);
document.getElementById('show-listings-comic-con').addEventListener('click', function() {
  showListings("Comic Con", "category");
  }, false);
document.getElementById('show-listings-jewelry').addEventListener('click', function() {
  showListings("Jewelry Shop", "category");
  }, false);
document.getElementById('show-listings-museum').addEventListener('click', function() {
  showListings("Museum", "category");
  }, false);

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// This function will loop through the markers array and display
// only those that are from a certain category
function showListings(data, type) {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    switch (type) {
      case "category":
        markerCheck = markers[i].id.category;
        break;
      case "name":
        markerCheck = markers[i].id.name;
    }
    if (markerCheck == data) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    } else {
      markers[i].setMap(null);
    }
  }
  map.fitBounds(bounds);
}


///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// This function will loop through the markers array and display them all.
function showAllListings(array) {
  var bounds = new google.maps.LatLngBounds();
  // Check if the array is a knockout observable or a normal array
  if (ko.isObservable(array)) {
    array = array();
  }
  // Delete all markers from the map
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  //Extend the boundaries of the map for each marker and display the markers
  for (var i = 0; i < array.length; i++) {
    array[i].setMap(map);
    bounds.extend(array[i].position);
  }
  map.fitBounds(bounds);
}

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// This function creates a Twitter feed for the respective place
// below the map
function createTwitterFeed(place) {
  if (place == "Carnegie Science Center") {
    place = "CarnegieSciCtr"
  } else if (place == "Geek Dot Jewelry"){
    place = "pmichaeldesign"
  } else if (place == "Victory Pointe Arcade and Gaming Cafe") {
    place ="VictoryPoint"
  } else {
    place = place.replace(/\s+/g, '');
  }
  var url = "https://publish.twitter.com/oembed?url=https://twitter.com/" + place;
  url += '&callback=?';

  $.ajax({
        method: 'GET',
        url: url,
        dataType: "jsonp",
        timeout: 8000,
      }).done(function(result) {
        result_html = "<br><h1>Twitter Results</h1>" + result.html
        $('#twitter').html(result_html);
      }).fail(function(result) {
        result_html = "<br><h1>Twitter Results</h1>\
                      <h3 class='result-information'>\
                      Sorry, this place is either not on Twitter\
                      or an error occured during API loading!</h3>"
        $('#twitter').html(result_html);
      });
}

function getFoursquare(position, name) {
  if (name == "Geek Dot Jewelry") {
    name = "Paul Michael Design"
  }
  var lat = position.lat();
  var lng = position.lng();
  var now = new Date();
  now = formatDate(new Date())
  var url = "https://api.foursquare.com/v2/venues/search"
  url += '?' + $.param({
      client_id: 'YOUR ID',
      client_secret: 'YOUR SECRET',
      'll' : lat + ',' + lng,
      'intent' : 'match',
      'name': name,
      'v': now
    }) + '&callback=?';

  $.ajax({
        method: 'GET',
        url: url,
        dataType: "jsonp",
        timeout: 8000,
      }).done(function(result) {
        if (result.meta.code != 200) {
          result_html = "<br><h1>Foursquare Results</h1>" +
                        "<h3 class='result-information'>Sorry, the following error\
                         occured during API call. Please try again or check\
                         below for more details!</h3><br><p>Error Code: " +
                         result.meta.code + "</p><p>Error Type: " +
                         result.meta.errorType + "</p><p>Error Details: " +
                         result.meta.errorDetail + "</p>";
          $('#foursquare').html(result_html);
          return;
        }
        if (result.response.venues.length == 0) {
          result_html = "<br><h1>Foursquare Results</h1>" +
                        "<h3 class='result-information'>Sorry, this place is not on Foursquare!</h3>"
          $('#foursquare').html(result_html);
          console.log("Not on Foursquare");
        } else {
        getFoursquareDetails(result.response.venues[0].id);
      }
      }).fail(function(result) {
        result_html = "<br><h1>Foursquare Results</h1>" +
                      "<h3 class='result-information'>Sorry, an error occured during API call. Please try again!</h3>"
        $('#foursquare').html(result_html);
        console.log("Error");
      });
}

function getFoursquareDetails(id) {
  var now = new Date();
  now = formatDate(new Date())
  var url = "https://api.foursquare.com/v2/venues/";
  url += id;

  $.ajax({
        url: url,
        dataType: "json",
        data: {
          client_id: 'YOUR ID',
          client_secret: 'YOUR SECRET',
          v: now,
          async: true
        },
        timeout: 8000,
      }).done(function(result) {
        if (result.response.venue.description == undefined) {
          var description = "No description on Foursquare."
        } else {
          var description = result.response.venue.description
        }
        var tips = "<h4 class='result-information-left'><strong>User Tips: </strong>"
        if (result.response.venue.tips.count == 0) {
          tips += "There are no user tips for this place."
        } else {
          tips += "<ul>"
          for(i=0; i < result.response.venue.tips.groups[0].items.length; i++) {
              tips += "<li>" + result.response.venue.tips.groups[0].items[i].text +
                      "</li>"
          }
          tips += "</ul>"
        }
        tips += "</h4>"
        var photoPrefix = result.response.venue.bestPhoto.prefix;
        var photoSize = "600x400";
        var photoSuffix = result.response.venue.bestPhoto.suffix;
        var photo = String(photoPrefix) + photoSize + String(photoSuffix);

        result_html = "<br><h1>Foursquare Results</h1>" +
                      "<h4 class='result-information'><strong>Rating: </strong>" +
                      result.response.venue.rating + "<br><br><div class='result-information'>\
                      <img class='venue-img' alt='Picture of Venue' src=" + photo +
                      "></div></h4> \
                      <h4 class='result-information-left'><strong>Description: </strong>" +
                      description + "</h4>" + tips
        $('#foursquare').html(result_html);

      }).fail(function(result) {
        // result_html = "<br><h1>Twitter Results</h1><h3 class='result-information'>Sorry, this place is not on Twitter!</h3>"
        // $('#twitter').html(result_html);
        console.log("error");
      });
}

function formatDate(date) {

  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return String(year) + String(month) + String(day);
}
