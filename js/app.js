var locations = [{
  category: 'Gun shop',
  title: 'Split Second Response',
  address: '7 W Main St, Thomasville, NC 27360',
  location: {
    lat: 35.882414,
    lng: -80.081858
  },
  phoneNum: '3366882466'
}, {
  category: 'Gun shop',
  title: 'The Gun Shop',
  address: '1481-D National Hwy, Thomasville, NC 27360',
  location: {
    lat: 35.924781,
    lng: -80.055255
  },
  phoneNum: '3368893222'
}, {
  category: 'Gun shop',
  title: 'Elite Arms',
  address: '1908 Liberty Dr, Thomasville, NC 27360',
  location: {
    lat: 35.854606,
    lng: -80.073548
  },
  phoneNum: '3368474406'
}, {
  category: 'Gun shop',
  title: 'Carolina Guns and Gear',
  address: '1223 E Dixie Dr #B, Asheboro, NC 27203',
  location: {
    lat: 35.696278,
    lng: -79.791669
  },
  phoneNum: '3366267296'
}, {
  category: 'Food',
  title: 'East Coast Wings',
  address: '920 Randolph St, Thomasville, NC 27360',
  location: {
    lat: 35.868354,
    lng: -80.073685
  },
  phoneNum: '3364742329'
}, {
  category: 'Food',
  title: 'Chopstix',
  address: '4424 Wallburg Landing Dr. Winston-Salem, NC 27107',
  location: {
    lat: 36.027158,
    lng: -80.163303
  },
  phoneNum: '3363069513'
}, {
  category: 'Food',
  title: 'Zaxbys',
  address: '1148 Randolph St, Thomasville, NC 27360',
  location: {
    lat: 35.855808,
    lng: -80.073251
  },
  phoneNum: '3363138636'
}, {
  category: 'Food',
  title: 'Casa De Sotos',
  address: '1800 Westchester Dr, High Point, NC 27262',
  location: {
    lat: 35.944306,
    lng: -80.034585
  },
  phoneNum: '3368864081'
}, {
  category: 'Food',
  title: 'Freddys Frozen Custard & Steakburgers',
  address: '4106 Brian Jordan Pl, High Point, NC 27265',
  location: {
    lat: 36.032787,
    lng: -79.957553
  },
  phoneNum: '3368831888'
}, {
  category: 'Gun Shop',
  title: 'SCB Guns and Ammo',
  address: '1 Hinkle St, Thomasville, NC 27360',
  location: {
    lat: 35.872790,
    lng: -80.076696
  },
  phoneNum: '3364911850'
}];


var map,
marker,
markers = [],
  arrayLength = locations.length;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 35.882637,
      lng: -80.081988
    },
    disableDefaultUI: true,
    zoom: 13
  });

  var bounds = new google.maps.LatLngBounds(),
    largeInfoWindow = new google.maps.InfoWindow();


  for (var i = 0; i < arrayLength; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var address = locations[i].address;
    //Setup string to make phone number easier to read
    var phoneNum = '(' + locations[i].phoneNum.slice(0, 3) + ') ' + locations[i].phoneNum.slice(3, 6) + '-' + locations[i].phoneNum.slice(6);
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
    locations[i].marker = marker;
    bounds.extend(markers[i].position);

    //Animate marker, open info window, and reset center
    //when marker is clicked
    marker.addListener('click', function() {
      toggleMarkerAnimation(this);
      map.setCenter(this.position);
      populateInfoWindow(this, largeInfoWindow);
    });


  } //if
  map.fitBounds(bounds);


  google.maps.event.addDomListener(window, 'resize', function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });
}


//function to animate map marker

function toggleMarkerAnimation(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){
      marker.setAnimation(null);
    },2100);

}

//Gets data from yelp api and sets the infowindow content
//Yelp function based on code sample from MarkN @ Udacity

function populateInfoWindow(marker, infoWindow) {
  var YELP_KEY = 'u6NKrgh6u0TjiqusYkohKQ',
    YELP_TOKEN = 'cevD3lpYb2h29kOIOSihvrXvkwjScqU5',
    YELP_KEY_SECRET = 'DspQn3gBAv0fSGz5iCCFE0253VY',
    YELP_TOKEN_SECRET = 'xHNuuQq7ncyZGrsU43nJsI1NoYM';

  /**
   * Generates a random number and returns it as a string for OAuthentication
   * @return {string}
   */

  function nonce_generate() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

  var yelp_url = 'https://api.yelp.com/v2/phone_search/',
    yelpData,
    infoWindowContent;
  var parameters = {
    oauth_consumer_key: YELP_KEY,
    oauth_token: YELP_TOKEN,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now() / 1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
    callback: 'cb', // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    phone: marker.phoneNum
  };

  //oauth library provided by Marco Bettioli
  var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
  parameters.oauth_signature = encodedSignature;

  var settings = {
    url: yelp_url,
    data: parameters,
    cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp'
  };

  // Send AJAX query via jQuery library.
  $.ajax(settings)
    .done(function(results) {
    var busNum = 0;
    //Check to make sure there is yelp data available for this business
    if (results.businesses[busNum]) {
      //check for the one case where there are two results for the same phone number
      //Use the second business in the results if true
      if (results.businesses[0].name === 'Pawn Way') {
        busNum = 1;
      }
      var loc_url,
        rating_img,
        rev_count;
      //Checks to make sure each field we use has data
      !!results.businesses[busNum].rating_img_url_small ? rating_img = results.businesses[busNum].rating_img_url_small : rating_img = 'No image available';

      !!results.businesses[busNum].review_count ? rev_count = ' (' + results.businesses[busNum].review_count + ') reviews' : rev_count = 'No reviews available';

      !!results.businesses[busNum].url ? loc_url = results.businesses[busNum].url : url = 'http://www.yelp.com';

       yelpData = '<a href="' + loc_url + '">Yelp</a>: ' + '<img src="' + rating_img + '">' + rev_count;
    } else {
      //Fills in data field if nothing is returned from Yelp
      yelpData = 'Location does not have a Yelp page.';
    }
  })
    .fail(function() {
    yelpData = 'Yelp API not available, please try again.';
    //alert('There was a problem retrieving Yelp data. Please wait a little bit and try again.');
  })
    .always(function() {
    infoWindowContent = '<div id="info-window"> Name: ' + marker.title + '<br/>' + 'Address: ' + marker.address + '<br/>' + 'Phone number: ' + marker.phoneNum + '<br/>' + yelpData + '</div>';
    infoWindow.setContent(infoWindowContent);
    infoWindow.open(map, marker);
  });

}

var viewModel = function() {

  locations.sort(function(first, second) {
    return first.title > second.title ? 1 : -1;
  });

  var self = this;

  self.categories = ko.observableArray(['All', 'Food', 'Gun shop']);
  self.selectedCategory = ko.observable('All');
  self.locationsArray = ko.observableArray(locations);



  //filter list based on option selected in dropdown box
  self.filterLocations = ko.computed(function() {
    var tempArray = [];
    if (self.selectedCategory() === 'All') {
      for (var i = 0; i < arrayLength; i++) {
        tempArray.push(this.locations[i]);
        //Have to do this because this code loads before the map markers are placed
        //without this check we get a undefined error
        if (this.locations[i].marker) {
          this.locations[i].marker.setVisible(true);
        }
      }
    } else {
      for (var j = 0; j < arrayLength; j++) {
        if (self.selectedCategory() === this.locations[j].category) {
          tempArray.push(this.locations[j]);
          this.locations[j].marker.setVisible(true);
        } else {
          this.locations[j].marker.setVisible(false);
        }
      }
    }
    self.locationsArray(tempArray);


  });


  // Open info window if location is clicked in list
  this.clickLocations = function(location) {
    google.maps.event.trigger(location.marker, 'click');
  };
};

ko.applyBindings(new viewModel());

function googleMapError() {
  alert('There was a problem loading the map. Please reload the page to try again.');
}


//Use jQuery to toggle visibilty of the sidebar
//Not sure how I feel about the animation in this. Might remove.
function toggleSideBar() {
  $(".side-bar").toggle("fast");
}