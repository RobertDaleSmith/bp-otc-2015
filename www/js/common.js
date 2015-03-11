var BP = {

	settings : {

		transition: 'height cubic-bezier(.62,.28,.23,.99) 0.7s',

		revealLabelsTogether: false

	}

};

Array.prototype.shuffle = function(){

	var array = this;
	
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
}