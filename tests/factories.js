function makeString(stringLength) {
	var text = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz                      ";
	for( var i=0; i < stringLength; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)) );
	return text.join('');
}


var _rows = [], 
	_fields = [
		{name: 'key', type: 'number'},
		{name: 'throwaway', type: 'string'},
		{name: 'name', type: 'suggest'},
		{name: 'select', type: 'select', options: ['First','Second','Third','Fourth']},
		{name: 'number', type: 'number'},
		{name: 'block', type: 'block'},
		{name: 'date', type: 'date'},
		{name: 'multiselect', type: 'multiselect', options: ['Illinois','Super Super Super Super Suoer Super Super Supser Suoer lng otion','Portugal','Spain','Texas','Colorado','Washington','Montana','Oregon']},
		{name: 'array', type: 'array', options: {} },
		{name: 'location', type: 'location', options: {} }
	]

for (var i=0; i < 10; i++) { 
	var row = {
		key: ko.observable(i+1), 
		throwaway: ko.observable( makeString(10) ),
		name: ko.observable( makeString(10) ),
		select: ko.observable( [null,'First','Second','Third','Fourth'][Math.floor( Math.random()*5) ] ),
		multiselect: ko.observable( [
			[null,'Illinois'][Math.floor( Math.random()*2)],
			[null,'Portugal'][Math.floor( Math.random()*2) ],
			[null,'Spain',][Math.floor( Math.random()*2) ],
			[null,'Texas',][Math.floor( Math.random()*2) ],
			[null,'Colorado',][Math.floor( Math.random()*2) ],
			[null,'Washington',][Math.floor( Math.random()*2) ],
			[null,'Montana',][Math.floor( Math.random()*2) ],
			[null,'Oregon'][Math.floor( Math.random()*2) ]
			 ].filter( function(el) { return el != null }) ),
		block: ko.observable( [
				makeString(Math.floor(Math.random()*20+10)),
				makeString(Math.floor(Math.random()*20+10)),
				makeString(Math.floor(Math.random()*20+10))
			].join("\n") ),
		date: ko.observable( (function() { var d = new Date('1/1/11'); d.setDate(i+1); return d.toDateString() })() ),
		number: ko.observable(Math.round(Math.random()*10) ),
		array: ko.observable( [
				[null,'Bus Trips'][Math.floor( Math.random()*2)],
				[null,'Trick or Vote'][Math.floor( Math.random()*2) ],
				[null,'Raves',][Math.floor( Math.random()*2) ]
			].filter( function(el) { return el != null }) ),
		location: ko.observable( { address: ko.observable('Not a real address'), latlng: ko.observable('44.'+Math.floor(Math.random()*10000)+',-123.'+Math.floor(Math.random()*100000) ) } )
	}
	_rows.push( row )
}