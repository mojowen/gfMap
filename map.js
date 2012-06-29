function gfMap(options) {
	this.ready = ko.observable(false)
	this.geolocationQueue = ko.observableArray([])

	if( typeof map == 'undefined' || typeof google == 'undefined' ) {
		var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?sensor=true&callback=map.start';
			document.body.appendChild(script);
			map = this;
	}
	
	this.start = function() {
		this.geocoder = new google.maps.Geocoder()
		this.maps = []
		this.ready(true)
	}
	function parseLocation(location) {
		var latlng = []; 
		for( var i in location ) { 
			if( typeof location[i] == 'number' ) latlng.push( location[i] )
		}
		latlng.sort()
		return latlng[1]+','+latlng[0];
	}


	this.geolocate = function(observable) {
		var obs = ko.toJS(observable), address = obs.address
		this.geolocationQueue.push( {observable: observable, address: address } )
	}

	this.geolocater = ko.computed( function() {
		var queue = this.geolocationQueue, flatQueue = queue()
		if( this.ready() && flatQueue.length > 0 ) {
			for (var i=0; i < flatQueue.length; i++) {
				var observable = flatQueue[i].observable, address = flatQueue[i].address
				queue.remove( queue[i] )
				this.geocoder.geocode( { 'address': address }, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						observable._initalAddress = address
						observable._fail(false)
						observable._googlePoint = results[0].geometry.location
						observable().latlng( parseLocation(results[0].geometry.location) )
					} else if( status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT ) {
						setTimeout( function() { queue.push( {observable: observable, address: address } ) }, 10000 )
					} else {
						observable._initalAddress = address
						observable._fail(true)
					}
				})
				
			};
		}
	},this)

	return map;

}