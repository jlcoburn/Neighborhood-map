var map;
var markers = [];
var fncIndex = 0;
var address;

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
    // address = getAddress(this.locations[i].location);
    console.log('map' + address);
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      phoneNum: phoneNum,
      address: getAddress(this.locations[i].location),
      animation: google.maps.Animation.DROP,
      id: i
    });

  markers.push(marker);
  bounds.extend(markers[i].position);

  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfoWindow);
  });

  marker.addListener('mouseover', function() {
    toggleMarkerAnimation(this);
  });

  marker.addListener('mouseout', function() {
    toggleMarkerAnimation(this);
  });

  }




  map.fitBounds(bounds);

  }


  function toggleMarkerAnimation(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
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
    var localAddress = '';
    fncIndex += 1;
    geocoder.geocode(
      { location: latlng
        //key: 'AIzaSyBy8KfHQZpZPD0knt4odz3iV56d9l68qPY'


      }, function(results, status) {
        if (status === 'OK') {
          //console.log('Try: ' + fncIndex + ' = ' + results[0].formatted_address);
          localAddress = results[0].formatted_address;
          console.log(localAddress);
          return localAddress;
        } /* else {
          console.log('Failed on try: ' + fncIndex);
          window.alert('Failed to get addresses due to: ' + status);
        } */
      });
  }
