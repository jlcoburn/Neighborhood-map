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

  self.clickLocations = function(location) {
    console.log(location.title);
  };

  if (this.selectedCategory === 'Food') {
    console.log('nom');
  }

};


var mapItems = function(data) {
  this.title = ko.observable(data.title);
  this.category = ko.observable(data.category);
  this.location = ko.observable(data.location);
};


/* self.updateList = ko.computed(function() {
  console.log(search_Req);
}); */



  ko.applyBindings(new ViewModel());

 // window.addEventListener('load', initMap);