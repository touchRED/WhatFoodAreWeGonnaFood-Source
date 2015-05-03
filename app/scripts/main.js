var map;
var infoWindow;
var service;

if('geolocation' in navigator){
	navigator.geolocation.getCurrentPosition(init);
}else{
	console.log("geolocation couldn't be initialized");
}

function init(position){
	var mapOptions = {
		center: new google.maps.LatLng(position.coords.latitude + 0.0035, position.coords.longitude),
		zoom: 16
	};

	var request = {
		location: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
		radius: 1000,
		types: ['restaurant']
	};

	map = new google.maps.Map(document.getElementById('mapness'), mapOptions);

	infoWindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);
}

function callback(results, status){
	if(status == google.maps.places.PlacesServiceStatus.OK){
		for(var i = 0; i < results.length; i++){
			createMarker(results[i]);
		}
	}
}

function createMarker(place){
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	service.getDetails({reference: place.reference}, function(details, status){
		google.maps.event.addListener(marker, 'click', function(){
			if(status == google.maps.places.PlacesServiceStatus.OK){
				infoWindow.setContent(details.name + '<br />' + details.formatted_phone_number + '<br />' + '<a href="' + details.website + '">' + details.website + '</a>');
			}else{
				infoWindow.setContent(place.name);
			}
			infoWindow.open(map, this);
		});
	});
}

// google.maps.event.addDomListener(window, 'load', init);
