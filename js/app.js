var locations = [
  {category: 'Gun shop', title: 'Split Second Response',  location: {lat: 35.882414, lng: -80.081858}},
  {category: 'Gun shop', title: 'The Gun Shop', location: {lat: 35.924781, lng: -80.055255}},
  {category: 'Gun shop', title: 'Elite Arms', location: {lat: 35.854606, lng: -80.073548}},
  {category: 'Gun shop', title: 'Carolina Guns and Gear', location: {lat: 35.696278, lng: -79.791669}},
  {category: 'food', title: 'East Coast Wings', location: {lat: 35.868354, lng: -80.073685}},
  {category: 'food', title: 'Chopstix', location: {lat: 36.027158, lng: -80.163303}},
  {category: 'food', title: 'Zaxbys', location: {lat: 35.855808, lng: -80.073251}}
  ];





var ViewModel = function() {

  locations.sort(function (first, second) { return first.title > second.title ? 1 : -1; });


  var self = this;


  //initialize a knockout observable array to hold locations
  this.placeList = ko.observableArray([]);
  this.categories = ko.observableArray(['Food','Gun Shop']);

/*  for (var index in locations) {
    console.log(locations[index].category);
    console.log(locations[index].title);
  } */

  // Assign locations to observable array
  locations.forEach(function(locIndex) {
    self.placeList.push(new mapItems(locIndex));
  });

};


var mapItems = function(data) {
  this.title = ko.observable(data.title);
  this.category = ko.observable(data.category);
  this.location = ko.observable(data.location);
};


/* self.updateList = ko.computed(function() {
  console.log(search_Req);
}); */

var map;
var markers = [];

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.882637, lng: -80.081988},
    zoom: 13
    });

 var bounds = new google.maps.LatLngBounds();
 var largeInfoWindow = new google.maps.InfoWindow();

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
      var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

  markers.push(marker);
  bounds.extend(markers[i].position);
  }


  map.fitBounds(bounds);



  }

var updateMarkers = function() {

}

  ko.applyBindings(new ViewModel());

 // window.addEventListener('load', initMap);