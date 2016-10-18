var locations = [
  {category: 'Gun shop', title: 'Split Second Response',  location: {lat: 35.882414, lng: -80.081858}, phoneNum: '+13366882466'},
  {category: 'Gun shop', title: 'The Gun Shop', location: {lat: 35.924781, lng: -80.055255}, phoneNum: '+13368893222'},
  {category: 'Gun shop', title: 'Elite Arms', location: {lat: 35.854606, lng: -80.073548}, phoneNum: '+13368474406'},
  {category: 'Gun shop', title: 'Carolina Guns and Gear', location: {lat: 35.696278, lng: -79.791669}, phoneNum: '+13366267296'},
  {category: 'food', title: 'East Coast Wings', location: {lat: 35.868354, lng: -80.073685}, phoneNum: '+13364742329'},
  {category: 'food', title: 'Chopstix', location: {lat: 36.027158, lng: -80.163303}, phoneNum: '+13363069513'},
  {category: 'food', title: 'Zaxbys', location: {lat: 35.855808, lng: -80.073251}, phoneNum: '+13363138636'}
  ];





var ViewModel = function() {

  locations.sort(function (first, second) { return first.title > second.title ? 1 : -1; });

  var self = this;


  //initialize a knockout observable array to hold locations
  this.placeList = ko.observableArray([]);
  this.categories = ko.observableArray(['Food','Gun Shop']);
  this.selectedCategory = ko.observable();
/*  for (var index in locations) {
    console.log(locations[index].category);
    console.log(locations[index].title);
  } */
  //console.log(this.selectedCategory.data);
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
    //Setup string to make phone number easier to read
    var phoneNum = '(' + locations[i].phoneNum.slice(2,5) + ') ' + locations[i].phoneNum.slice(5,8) + '-' + locations[i].phoneNum.slice(8);
    //call function to get address from lat lng coordinates
    var address = getAddress(locations[i].location);
    console.log(getAddress(locations[i].location));
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      phoneNum: phoneNum,
      address: address,
      animation: google.maps.Animation.DROP,
      id: i
    });

  markers.push(marker);
  bounds.extend(markers[i].position);

  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfoWindow);
  });
  }


  map.fitBounds(bounds);

  }

  function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div id="infoWindow"> Name: ' + marker.title + '<br/>' + 'Address:' + marker.address + '<br/>' + 'Phone number: ' + marker.phoneNum + '</div>');
      infoWindow.open(map, marker);
      infoWindow.addListener('closeclick', function() {
        infoWindow.setContent(null);
      });
    }
  }


  function getAddress(latlng) {
    var geocoder = new google.maps.Geocoder();
    var address;

    geocoder.geocode(
      { location: latlng,
        key: 'AIzaSyBy8KfHQZpZPD0knt4odz3iV56d9l68qPY'


      }, function(results, status) {
        if (status === 'OK') {
          address = results[0].formatted_address;

        } else {
          window.alert('failed due to ' + status);
        }
      });
      return address;
  }

/*var updateMarkers = function() {

}*/

  ko.applyBindings(new ViewModel());

 // window.addEventListener('load', initMap);