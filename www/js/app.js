BP.views.init();

BP.handlers.init();


// Automated demo stuff. 
var interval;
function demo(bool){
	if(bool) {

		var pointCount = 1;

		$('div.mapPoint')[0].click();
		
		interval = setInterval(function(){

			$('div.mapPoint')[pointCount].click();
			pointCount++;
			if( pointCount == $('div.mapPoint').length ) pointCount = 0;

		}, 500 );

	} else {

		window.clearInterval(interval);

	}
}


BP.curves.init();

var pathStr = "M1031 325C1031 500 1271 530 1271 375";
// var path = {

//   X1 : 1031,
//   Y1 : 325,
//   Xc1: 1031,
//   Yc1: 500,
//   Xc2: 1271,
//   Yc2: 530,
//   X2: 1271,
//   Y2: 375

// }

// pathStr = pathToStr(path);

function pathToStr(){
	return "M"+path.X1+" "+path.Y1+"C"+path.Xc1+" "+path.Yc1+" "+path.Xc2+" "+path.Yc2+" "+path.X2+" "+path.Y2+"";
}