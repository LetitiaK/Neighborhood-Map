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
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 40.440625, lng: -79.995886},
     zoom: 13,
     styles: styles,
     mapTypeControl: false
   });

   geocoder = new google.maps.Geocoder();

   var locations = [
    {title: 'Chipotle1', location: '211 FORBES AVE, PITTSBURGH, PA 15222'},
    {title: 'Chipotle2', location: '3615 FORBES AVE, PITTSBURGH, PA 15213'},
    {title: 'Chipotle3', location: '4611 FORBES AVE, PITTSBURGH, PA 15213'},
    {title: 'Chipotle4', location: '4800 BAUM BLVD, PITTSBURGH, PA 15213'},
    {title: 'Chipotle5', location: '5986 CENTRE AVE, EAST LIBERTY, PA 15206'},
    {title: 'Chipotle6', location: '1614 COCHRAN RD, PITTSBURGH, PA 15220'}
  ];

  var largeInfowindow = new google.maps.InfoWindow();


  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;

    geocoder.geocode( {'address': position}, function(results, status) {
      if (status == 'OK') {
        var marker = new google.maps.Marker({
          position: results[0].geometry.location,
          title: "Chipotle " + results[0].formatted_address,
          animation: google.maps.Animation.DROP,
          id: i
        });

        markers.push(marker);
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
      }
    });
  }

  document.getElementById('show-listings').addEventListener('click', showListings);
  document.getElementById('hide-listings').addEventListener('click', hideListings);
}

  function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  }

  // This function will loop through the markers array and display them all.
  function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
      bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
  }


  // This function will loop through the listings and hide them all.
  function hideListings() {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  function hideShowMenu() {
    var div = document.getElementById("options-box");
    var button = document.getElementById("upper");
    var map = document.getElementById("map");
    if (div.style.display === "none") {
       div.style.display = "block";
       map.style.left = "362px";
       button.style.width = "340px";
   } else {
       div.style.display = "none";
       map.style.left = "75px";
       button.style.width = "60px";
   }
  }
