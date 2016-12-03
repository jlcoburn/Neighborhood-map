
var locations = [
  {
   category: 'Gun shop',
   title: 'Split Second Response',
   address: '7 W Main St, Thomasville, NC 27360',
   location: {lat: 35.882414, lng: -80.081858},
   phoneNum: '+13366882466'
  },
  {
   category: 'Gun shop',
   title: 'The Gun Shop',
   address: '1481-D National Hwy, Thomasville, NC 27360',
   location: {lat: 35.924781, lng: -80.055255},
   phoneNum: '+13368893222'
  },
  {
   category: 'Gun shop',
   title: 'Elite Arms',
   address: '1908 Liberty Dr, Thomasville, NC 27360',
   location: {lat: 35.854606, lng: -80.073548},
   phoneNum: '+13368474406'},
  {
   category: 'Gun shop',
   title: 'Carolina Guns and Gear',
   address: '1223 E Dixie Dr #B, Asheboro, NC 27203',
   location: {lat: 35.696278, lng: -79.791669},
   phoneNum: '+13366267296'
  },
  {
   category: 'Food',
   title: 'East Coast Wings',
   address: '920 Randolph St, Thomasville, NC 27360',
   location: {lat: 35.868354, lng: -80.073685},
   phoneNum: '+13364742329'
  },
  {
   category: 'Food',
   title: 'Chopstix',
   address: '4424 Wallburg Landing Dr. Winston-Salem, NC 27107',
   location: {lat: 36.027158, lng: -80.163303},
   phoneNum: '+13363069513'
  },
  {
   category: 'Food',
   title: 'Zaxbys',
   address: '1148 Randolph St, Thomasville, NC 27360',
   location: {lat: 35.855808, lng: -80.073251},
   phoneNum: '+13363138636'
  }
  ];


var map;
var marker;
var markers = [];
var arrayLength = locations.length;

  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 35.882637, lng: -80.081988},
    disableDefaultUI: true,
    zoom: 13
    });

  var bounds = new google.maps.LatLngBounds();
  var largeInfoWindow = new google.maps.InfoWindow();


  for (var i = 0; i < arrayLength; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var address = locations[i].address;
    //Setup string to make phone number easier to read
    var phoneNum = '(' + locations[i].phoneNum.slice(2,5) + ') ' + locations[i].phoneNum.slice(5,8) + '-' + locations[i].phoneNum.slice(8);
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      phoneNum: phoneNum,
      address: address,
      yelpConent: 'yelp api is hard',//getYelpData(locations[i].phoneNum),
      animation: google.maps.Animation.DROP,
      id: i
    });

  markers.push(marker);
  locations[i].marker = marker;
  bounds.extend(markers[i].position);

 marker.addListener('click', function() {
    //console.log('listener ' + this);
    toggleMarkerAnimation(this);
    populateInfoWindow(this, largeInfoWindow);
  });

  //Bounce marker when mouse is over, stop bounce when mouse moves out
/*  marker.addListener('mouseover', function() {
    toggleMarkerAnimation(this);
  });

  marker.addListener('mouseout', function() {
    toggleMarkerAnimation(this);

  }); */

  } //if
    map.fitBounds(bounds);

  }


  //function to animate map marker
  function toggleMarkerAnimation(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  // Populate infowindow with info from array and from Yelp
  function populateInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.marker = marker;
      infoWindow.setContent('<div id="infoWindow"> Name: ' + marker.title + '<br/>' + 'Address: ' + marker.address + '<br/>' + 'Phone number: ' + marker.phoneNum + '<br/>' + marker.yelpConent + '</div>');
      infoWindow.open(map, marker);
      infoWindow.addListener('closeclick', function() {
        infoWindow.setContent(null);
      });
    }
  }

  function closeInfoWindow(marker, infoWindow) {
    infoWindow.close();
    infoWindow.setContent(null);
  }

//Yelp function based on code sample from MarkN @ Udacity

  function getYelpData(phone) {

    var YELP_KEY_SECRET = 'DspQn3gBAv0fSGz5iCCFE0253VY';
    var YELP_TOKEN_SECRET = 'xHNuuQq7ncyZGrsU43nJsI1NoYM';

/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
    function nonce_generate() {
      return (Math.floor(Math.random() * 1e12).toString());
}

    var yelp_url = 'https://api.yelp.com/v2/phone_search/?phone=' + phone;

    var parameters = {
      oauth_consumer_key: 'u6NKrgh6u0TjiqusYkohKQ',
      oauth_token: 'cevD3lpYb2h29kOIOSihvrXvkwjScqU5',
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    };

    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    var settings = {
      url: yelp_url,
      data: parameters,
      cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
      dataType: 'jsonp',
      success: function(results) {
        console.log(businesses[0].rating);
      },
      fail: function() {
        console.log('something went wrong');
      }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);

  }

var viewModel = function(marker) {

  locations.sort(function (first, second) { return first.title > second.title ? 1 : -1; });

  var self = this;


  //initialize a knockout observable array to hold locations
  self.categories = ko.observableArray(['All','Food','Gun shop']);
  self.selectedCategory = ko.observable();
  self.locationsArray = ko.observableArray(locations);

/*  self.filterLocations = ko.computed(function() {
    if (self.selectedCategory()==='All') {
        //self.locationsArray().length = 0;
        //console.log('hiphip' + self.locationsArray().length);
        for (var i=0; i < arrayLength; i++) {
          //console.log('hooray');
          self.locationsArray(locations[i]);
          console.log('in the loop' + self.locationsArray());
        }

    } else if (self.selectedCategory()==='Gun shop') {
        self.locationsArray().length = 0;
        for (var i=0; i < arrayLength; i++) {
          if (self.locations[i].category === 'Gun shop') {
            console.log('yes');
            self.locationsArray(locations[i]);
            console.log(self.locationsArray());
          }
        }

    } else if (self.selectedCategory()==='Food') {
      self.locationsArray().length = 0;
      for (i=0; i < 7; i++) {
        if (this.locations[i].category === self.selectedCategory()) {
          //i.markers.setVisible();
          self.locationsArray().push(this.locations[i]);
          console.log('step['+i+']'+ this.locations[i].title);
          console.log(self.locationsArray());
          }
        }
    }
  }); */

  self.filterLocations = ko.computed(function() {


  });

  // Open info window if location is clicked in list
  this.clickLocations = function(location) {
    google.maps.event.trigger(location.marker, 'click');
  };

};

  ko.applyBindings(new viewModel());


  //Use jQuery to toggle visibilty of the sidebar
  //Not sure how I feel about the animation in this. Might remove.
  function toggleSideBar() {
    $(".sideBar").toggle("fast");
  }



