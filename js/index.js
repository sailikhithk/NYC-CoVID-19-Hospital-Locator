 var map;
 var markers = [];
 var infoWindow;
 var currLatitude;
 var currLongitude;

 function initMap() {
    var New_York = {
        lat: 40.7128,
        lng: -74.0060,
    }
     
     map = new google.maps.Map(document.getElementById('map'), {
     center: New_York,
     zoom: 15,
     styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
     ]
     });

     /* Initialise the Info Window */
     infoWindow = new google.maps.InfoWindow();

     /* Initialize the Hospital list */
     searchHospitals();
     setOnClickListener();
     getLocation();
 }

 function displayhospitals (hospitals) {
     var hospitalsList ="";
     var address;
     var phone;
    hospitals.forEach(function(hospital, index) {
		name=hospital.name;
        address = hospital.address;
        phone = hospital.phoneNumber;
        numBed = hospital.numBeds;
		emptyBed=hospital.emptyBeds;
		zipCode=hospital.zipCode;
        hospitalsList += `
        <div class="hospital-container">
            <div class="hospital-container-background">
                <div class="hospital-info-container"> 
                    <div class="hospital-address">
                        <span>${name}</span> 
                        <span>${address}</span>
                        <span>${zipCode}</span>
						</div>
                    <div class="hospital-phone-number">Ph: ${phone}</div>
                </div>
                <div class="hospital-number-container">
                    <div class="hospital-number">${index+1}</div>
                </div>
            </div>
        </div>
        `
    });
    document.querySelector('.hospitals-list').innerHTML = hospitalsList;
   }

   /* Show hospitals pin markers on map */
   function showhospitalsMarker(hospitals, search) {
    var latlng;
    var name;
    var address;
    var phoneNumber;
    var numBed;
    var bounds = new google.maps.LatLngBounds();
    hospitals.forEach(function(hospital, index) {
    latlng = new google.maps.LatLng(
        hospital.lat,
        hospital.lng);
    name = hospital.name;
    address = hospital.address;
    phoneNumber = hospital.phoneNumber;
    numBed = hospital.numBeds;
	emptyBed=hospital.emptyBeds;
    var rating = hospital.rating;
    
    createMarker(latlng, name, address, phoneNumber, numBed, emptyBed,index, rating);
    setMarkerDirections(hospital.lat, hospital.lng, index);
    setMarkerAnimations(markers[index], search)
    bounds.extend(latlng);
   });
   map.fitBounds(bounds);
}

function setMarkerAnimations (marker, search) {
    if (search == true)
        marker.setAnimation(google.maps.Animation.BOUNCE);
    else
        marker.setAnimation(google.maps.Animation.DROP);
}

function createMarker(latlng, name, address, phoneNumber, numBed, emptyBed, index, rating) {
var html = `
    <div class="hospital-info-window">
        <div class="hospital-info-name">
            ${name} &nbsp ${rating}<span class="fa fa-star checked fa-xs"></span>
        </div>
        <div class="hospital-info-status">
            Empty Beds: ${emptyBed}
        </div>
        <div id="hospital-address-id" class="hospital-info-address">
            <div class="circle">
                <i class="fas fa-location-arrow"></i>
            </div>
            ${address}
        </div>
        <div class="hospital-info-phone">
            <div class="circle">
                <i class="fas fa-phone-alt"></i>
            </div>
            ${phoneNumber}
        </div>
        <div class="hospital-info-beds">
            <div class="circle">
                <i class="fas fa-procedures"></i>
            </div>
            Total: ${numBed}
        </div>
    </div>
    `
var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index+1}`,
    icon: {
        url: './img/hospital.png',
        size: new google.maps.Size(60, 62),
    },
    animation: google.maps.Animation.DROP,
});

google.maps.event.addListener(marker, 'mouseover', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
});
markers.push(marker);
}



function setMarkerDirections(lat, long, index) {
google.maps.event.addListener(markers[index], 'click', function() {
    setOnClickListenerAddress(lat, long);
});
}

/* Open the info window marker on hospital selection in hospitals list */
function setOnClickListener() {
    var hospitalElements = document.querySelectorAll('.hospital-container');
    hospitalElements.forEach(function(elem, index) {
        elem.addEventListener('click', function() {
            google.maps.event.trigger(markers[index], 'mouseover');
        })
    })
}

function clearLocations(){
infoWindow.close();
for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
}
markers.length = 0; /* Find out why */
}

/* Allow a user to search for the hospitals using zip code */
function searchHospitals() {
    var search = false;
    var zipCode = document.getElementById('zip-code-input').value;
    if (zipCode) {
    var foundHospitals = [];
    hospitals.forEach(function(hospital){
        var postal = hospital.zipCode.substring(0,5);
        if (zipCode == hospital.zipCode || zipCode == postal) {
            foundHospitals.push(hospital);
            /* FIXME zoom-out a little bit when results are few, it gets too zoomed */
        } else {
            /* FIXME:Handle this */
        }
    });
    search = true;
    clearLocations();
} else {
    foundHospitals = hospitals; 
}
displayhospitals(foundHospitals);
showhospitalsMarker(foundHospitals, search);
}

function saveCurrentLocation(position) {
    currLatitude = position.coords.latitude;
    currLongitude = position.coords.longitude;
    console.log(currLatitude, currLongitude);
 }

function errorHandler(err) {
    if(err.code == 1) {
       alert("Welcome");
    } else if( err.code == 2) {
      alert("Welcome");
    }
 }

function getLocation(){
    if(navigator.geolocation){
       // timeout at 60000 milliseconds (60 seconds)
       var options = {timeout:60000};
       navigator.geolocation.getCurrentPosition
       (saveCurrentLocation, errorHandler, options);
    } else{
       alert("Sorry, browser does not support geolocation!");
    }
 }

function setOnClickListenerAddress(lat, lng) {
    
            var url = "https://www.google.com/maps/dir/?api=1";
            var origin = "&origin=" + currLatitude + "," + currLongitude;
            var destination = "&destination=" + lat + "," + lng;
            var newUrl = new URL(url + origin + destination);
            console.log(newUrl);
            window.open(newUrl, '_blank');

            
}



/* experimental code here */

