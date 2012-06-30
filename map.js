function gfMap(options) {
	this.ready = ko.observable(false)
	this.geolocationQueue = ko.observableArray([])
	this.mapMakingQueue = ko.observableArray([])
	this.maps

	
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
			if( typeof google == 'undefined' ) throw 'No Google!'
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

	this.mapper = ko.computed( function() {
		var queue = this.mapMakingQueue()
		if( this.ready() && queue.length > 0 ) {
			for (var i=0; i < queue.length; i++) {
				this.makeMap(queue[i][0],queue[i][1],queue[i][2])
			};
		}
	},this)

	function gfMapped(rows, field, div) {
		this.rawPoints = rows
		this.field = field
		this.div = div
		return this
	}


	this.makeMap = function(data, field, options)  {
		var options = options || {},
			obj = options.obj || {},
			scope = typeof options.obj == 'string' ? window[obj] : obj,
			map = new gfMapped( data, field, typeof scope == 'undefined' || typeof scope.div == 'undefined' ? ko.observable('') : scope.div )

	map.infoContent = options.infoContent && typeof options.infoContent == 'function' ? options.infoContent : function() { return '' }
	map.markers = []


	var ready = this.ready
	map.mapOptions = ko.computed( function() { 
		if( ready() ) return {
			zoom: 4,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: new google.maps.LatLng(45, -122)
		}
	},this)

	map.gMap = ko.computed(function() {
		var div = this.div()
		if( div.nodeType === 1 && ready() ) return new google.maps.Map( this.div(), this.mapOptions() )
	},map)

	map.info = ko.computed( function() { 
		if( ready() ) return new google.maps.InfoWindow({
			content: '',
			maxWidth: 200
		});
	},this)

	map.points = ko.computed(function() {
		if( !ready() ) return []
		var rawPoints = ko.toJS( this.rawPoints ), gMap = this.gMap()
		for (var i=0; i < this.markers.length; i++) {
			this.markers[i].point.setMap(null)
		};
		for (var i=0; i < rawPoints.length; i++) {
			var row = rawPoints[i], latlng = row[this.field].latlng
			if( latlng != '' ) {
				var parse = latlng.split(','),
					point = new google.maps.LatLng(parse[0], parse[1]),
					content = this.infoContent(row)
					gPoint =  new google.maps.Marker({
						position: point,
						map: gMap,
						draggable: false,
						animation: google.maps.Animation.DROP,
						content: content
					})

				if( content != '' ) {
					info = this.info()
					google.maps.event.addListener( gPoint, 'click', function() {
						info.setContent(this.content)
						info.open(gMap,this)
					})
				} 

				this.markers.push( {
					lat: parse[0],
					lng: parse[1],
					point:gPoint
				});
			}
		};
		return this.markers
	},map)

	map.centerAndZoom = ko.computed(function() {
		var gMap = this.gMap()
		if( typeof gMap != 'undefined' ) {
				var points = this.points(),
					allLats = this.points().map( function(el) { return parseFloat(el.lat) }),
					allLngs = this.points().map( function(el) { return parseFloat(el.lng) }),
					maxLats = Math.max.apply(Math, allLats),
					minLats = Math.min.apply(Math, allLats),
					maxLngs =  Math.max.apply(Math, allLngs),
					minLngs = Math.min.apply(Math, allLngs),
					globe = 256,
					angleLng = maxLngs - minLngs,
					angleLng = angleLng < 0 ? angleLng + 360 : angleLng,
					angleLat = maxLats - minLats
					angle = angleLng > angleLat ? angleLng : angleLat,

					newCenter = new google.maps.LatLng( ( maxLats + minLats ) / 2, ( maxLngs + minLngs ) / 2 ),

					newZoom = Math.floor(Math.log(960 * 360 / angle / globe) / Math.LN2) - 2

			 	gMap.setCenter(newCenter)
			 	gMap.setZoom(newZoom)

				return {center: newCenter, zoom: newZoom }
		}
	},map)


		map.setMap = function(id) {
			map.div( id )
		}

		if( typeof obj == 'string' ) return window[obj] = map
		else { return map }
	}

	ko.bindingHandlers.gfMap = {
		init: function(element,valueAccessor) {
			var map = valueAccessor()
			if( element.id == '' ) {
				element.id = 'gfMap_'+new Date().getTime()
			}
			map.setMap( element )
		}
	};



	if( typeof this.constructor.map == 'undefined' || typeof google == 'undefined' ) {
		var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://maps.googleapis.com/maps/api/js?sensor=true&callback=gfMap.map.start';
			document.body.appendChild(script);
			return this.constructor.map = this;
	}


}