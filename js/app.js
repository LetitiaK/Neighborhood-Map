var map;
var markers = [];

function initMap() {
  var styles =
  [{"featureType":"all",
  "elementType":"all",
  "stylers":[{"visibility":"on"}]},
  {"featureType":"all",
  "elementType":"labels",
  "stylers":[{"visibility":"off"},
  {"saturation":"-100"}]},
  {"featureType":"all",
  "elementType":"labels.text.fill",
  "stylers":[{"saturation":36},
  {"color":"#000000"},
  {"lightness":40},
  {"visibility":"off"}]},
  {"featureType":"all",
  "elementType":"labels.text.stroke",
  "stylers":[{"visibility":"off"},
  {"color":"#000000"},
  {"lightness":16}]},
  {"featureType":"all",
  "elementType":"labels.icon",
  "stylers":[{"visibility":"off"}]},
  {"featureType":"administrative",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#000000"},
  {"lightness":20}]},
  {"featureType":"administrative",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#000000"},
  {"lightness":17},{"weight":1.2}]},
  {"featureType":"landscape",
  "elementType":"geometry",
  "stylers":[{"color":"#000000"},
  {"lightness":20}]},
  {"featureType":"landscape",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#4d6059"}]},
  {"featureType":"landscape",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#4d6059"}]},
  {"featureType":"landscape.natural",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#4d6059"}]},
  {"featureType":"poi",
  "elementType":"geometry",
  "stylers":[{"lightness":21}]},
  {"featureType":"poi",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#4d6059"}]},
  {"featureType":"poi",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#4d6059"}]},
  {"featureType":"road",
  "elementType":"geometry",
  "stylers":[{"visibility":"on"},
  {"color":"#7f8d89"}]},
  {"featureType":"road",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#7f8d89"}]},
  {"featureType":"road.highway",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#7f8d89"},
  {"lightness":17}]},
  {"featureType":"road.highway",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#7f8d89"},
  {"lightness":29},{"weight":0.2}]},
  {"featureType":"road.arterial",
  "elementType":"geometry",
  "stylers":[{"color":"#000000"},
  {"lightness":18}]},
  {"featureType":"road.arterial",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#7f8d89"}]},
  {"featureType":"road.arterial",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#7f8d89"}]},
  {"featureType":"road.local",
  "elementType":"geometry",
  "stylers":[{"color":"#000000"},
  {"lightness":16}]},
  {"featureType":"road.local",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#7f8d89"}]},
  {"featureType":"road.local",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#7f8d89"}]},
  {"featureType":"transit",
  "elementType":"geometry",
  "stylers":[{"color":"#000000"},
  {"lightness":19}]},
  {"featureType":"water",
  "elementType":"all",
  "stylers":[{"color":"#2b3638"},
  {"visibility":"on"}]},
  {"featureType":"water",
  "elementType":"geometry",
  "stylers":[{"color":"#2b3638"},
  {"lightness":17}]},
  {"featureType":"water",
  "elementType":"geometry.fill",
  "stylers":[{"color":"#24282b"}]},
  {"featureType":"water",
  "elementType":"geometry.stroke",
  "stylers":[{"color":"#24282b"}]},
  {"featureType":"water",
  "elementType":"labels",
  "stylers":[{"visibility":"off"}]},
  {"featureType":"water",
  "elementType":"labels.text",
  "stylers":[{"visibility":"off"}]},
  {"featureType":"water",
  "elementType":"labels.text.fill",
  "stylers":[{"visibility":"off"}]},
  {"featureType":"water",
  "elementType":"labels.text.stroke",
  "stylers":[{"visibility":"off"}]},
  {"featureType":"water",
  "elementType":"labels.icon",
  "stylers":[{"visibility":"off"}]}]
   map = new google.maps.Map(document.getElementById('map'), {
     center: {lat: 40.7413549, lng: -73.99802439999996},
     zoom: 13,
     styles: styles,
     mapTypeControl: false
   });

   var locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
    {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
    {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
    {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
    {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
    {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
  ];

  var largeInfowindow = new google.maps.InfoWindow();


  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;

    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
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
