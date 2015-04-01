var BP = {

	settings : {

		revealLabelsTogether: true,

		transition: 'height cubic-bezier(.62,.28,.23,.99) 0.7s'

	},

	intervals : {

		sequences: null,
		arrowDelay: null

	},

	arrows : {}

};

// Initializes NW.js gui object.
var gui = null; try{gui = require('nw.gui');}catch(e){console.log('NW.js libs not detected.');}

var shuffle = function(array){

	// var array = this;
	
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;

	}

	return array;
	
};

Number.prototype.round = function(places) {

	if(!places) places = 0;
	var multiplier = Math.pow(10, places);
	return Math.round(this * multiplier) / multiplier;

};

String.prototype.contains = function(subStr){

	return (this.indexOf(subStr) > -1);

};

String.prototype.replaceAll = function (find, replace) {

	return this.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);

};

String.prototype.remove = function (str) {

	return this.replaceAll(str,'');

};

$.fn.cssAnimationReset = function(){
	
	this.each(function(){

		$(this ).data("transitioning", 0)
				.css('height', '')
				.css('transition', '')
				.css('webkit-transition', '')
				.removeClass('is-opened');

	});

};