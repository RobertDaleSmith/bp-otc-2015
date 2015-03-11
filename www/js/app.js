BP.views.init();

BP.handlers.init();


$('div#deployments span.title').click();


// Automated demo stuff. 
var interval;
function demo(bool){

	if(bool){

		var pointCount = 1;

		$('div.mapPoint')[0].click();
		
		interval = setInterval(function(){

			$('div.mapPoint')[pointCount].click();
			pointCount++;
			if( pointCount == $('div.mapPoint').length )
				pointCount = 0;

		}, 500 );

	}else{

		window.clearInterval(interval);

	}


}
