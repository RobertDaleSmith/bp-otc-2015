BP.views.init();

BP.handlers.init();




function demo(){

	var pointCount = 1;

	$('div.mapPoint')[0].click();
	
	setInterval(function(){

		$('div.mapPoint')[pointCount].click();
		pointCount++;
		if( pointCount == $('div.mapPoint').length )
			pointCount = 0;

	}, 1500 );

}