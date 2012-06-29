function makeString(stringLength) {
	var text = [];
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz                      ";
	for( var i=0; i < stringLength; i++ ) text.push(possible.charAt(Math.floor(Math.random() * possible.length)) );
	return text.join('');
}

// Test data dumped from Go Fight Win - not super accurate
var _rows = '[{"key":3319,"list":"Location Testing","created_at":"2012-06-28T18:51:15Z","updated_at":"2012-06-28T18:51:15Z","location!":{"address":"2735 NW Glenwood Dr\nCorvallis OR 97330","latlng":"44.592005,-123.32132899999999"},"_menu":"rowMenu"},{"key":3317,"list":"Location Testing","created_at":"2012-06-28T18:51:15Z","updated_at":"2012-06-28T18:51:15Z","location!":{"address":"3522 N Borthwick Ave\nPortland OR 97227","latlng":"45.5485585,-122.67343370000003"},"_menu":"rowMenu"},{"key":3316,"list":"Location Testing","created_at":"2012-06-28T18:51:15Z","updated_at":"2012-06-28T18:51:15Z","location!":{"address":"333 SE 2nd Ave Portland","latlng":"45.5209363,-122.66365180000003"},"_menu":"rowMenu"},{"key":3315,"list":"Location Testing","created_at":"2012-06-28T18:51:15Z","updated_at":"2012-06-28T18:51:15Z","location!":{"address":"","latlng":""},"_menu":"rowMenu"},{"key":3314,"list":"Location Testing","created_at":"2012-06-28T18:51:15Z","updated_at":"2012-06-28T18:51:15Z","location!":{"address":"","latlng":""},"_menu":"rowMenu"},{"key":3313,"list":"Location Testing","created_at":"2012-06-28T18:44:37Z","updated_at":"2012-06-28T18:44:37Z","location!":{"address":"","latlng":""},"_menu":"rowMenu"}]';