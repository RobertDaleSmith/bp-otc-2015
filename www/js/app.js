BP.views.init();

BP.handlers.init();


// $('div#deployments span.title').click();



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




var pathStr = "M1031 325C1080 500 1100 500 1271 375";
var path = {

	X1 : 1031,
	Y1 : 325,
	Xc1: 1080,
	Yc1: 500,
	Xc2: 1100,
	Yc2: 500,
	X2: 1271,
	Y2: 375

}

pathStr = pathToStr(path);

function pathToStr(){
	return "M"+path.X1+" "+path.Y1+"C"+path.Xc1+" "+path.Yc1+" "+path.Xc2+" "+path.Yc2+" "+path.X2+" "+path.Y2+"";
}

var loop = null;
function play(){

	try{
		if(loop) clearInterval(loop);

		var lambda = 0;
		var loop = setInterval(function(){

			lambda = lambda + 0.01;

			$('#test_lambda').attr('d', interpolateCubicBezierCurve(
				0,
				lambda,
				path.X1,
				path.Y1,
				path.Xc1,
				path.Yc1,
				path.Xc2,
				path.Yc2,
				path.X2,
				path.Y2 
			));

			if(lambda >= 1) {
				clearInterval(loop);
			}

        },10);

    }catch(e){}

}


function interpolateCubicBezierCurve(
                                      lambdaStart,
                                      lambdaEnd,
                                      xAnchorStart,
                                      yAnchorStart,
                                      xHandleStart,
                                      yHandleStart,
                                      xHandleEnd,
                                      yHandleEnd,
                                      xAnchorEnd,
                                      yAnchorEnd 
                                    ) {
			'use strict';

			var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, path, txt;

			if (lambdaStart > 0.0) {
				x0 = xAnchorStart + lambdaStart * ( xHandleStart - xAnchorStart );
				y0 = yAnchorStart + lambdaStart * ( yHandleStart - yAnchorStart );
				x1 = xHandleStart + lambdaStart * ( xHandleEnd   - xHandleStart );
				y1 = yHandleStart + lambdaStart * ( yHandleEnd   - yHandleStart );
				x2 = xHandleEnd   + lambdaStart * ( xAnchorEnd   - xHandleEnd   );
				y2 = yHandleEnd   + lambdaStart * ( yAnchorEnd   - yHandleEnd   );

				x3 = x0 + lambdaStart * ( x1 - x0 );
				y3 = y0 + lambdaStart * ( y1 - y0 );
				x4 = x1 + lambdaStart * ( x2 - x1 );
				y4 = y1 + lambdaStart * ( y2 - y1 );

				xAnchorStart = x3 + lambdaStart * ( x4 - x3 );
				yAnchorStart = y3 + lambdaStart * ( y4 - y3 );
				xHandleStart = x4;
				yHandleStart = y4;
				xHandleEnd   = x2;
				yHandleEnd   = y2;
			}

			if ( lambdaEnd < 1.0 ) {
				x0 = xAnchorStart + lambdaEnd * ( xHandleStart - xAnchorStart );
				y0 = yAnchorStart + lambdaEnd * ( yHandleStart - yAnchorStart );
				x1 = xHandleStart + lambdaEnd * ( xHandleEnd   - xHandleStart );
				y1 = yHandleStart + lambdaEnd * ( yHandleEnd   - yHandleStart );
				x2 = xHandleEnd   + lambdaEnd * ( xAnchorEnd   - xHandleEnd   );
				y2 = yHandleEnd   + lambdaEnd * ( yAnchorEnd   - yHandleEnd   );

				x3 = x0 + lambdaEnd * ( x1 - x0 );
				y3 = y0 + lambdaEnd * ( y1 - y0 );
				x4 = x1 + lambdaEnd * ( x2 - x1 );
				y4 = y1 + lambdaEnd * ( y2 - y1 );

				xHandleStart = x0;
				yHandleStart = y0;
				xHandleEnd   = x3;
				yHandleEnd   = y3;
				xAnchorEnd   = x3 + lambdaEnd * ( x4 - x3 );
				yAnchorEnd   = y3 + lambdaEnd * ( y4 - y3 );
			}

			// path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

			txt  = 'M' +  xAnchorStart + ' ' +  yAnchorStart;
			txt += 'C' +  xHandleStart + ' ' +  yHandleStart;
			txt += ' ' +  xHandleEnd   + ' ' +  yHandleEnd  ;
			txt += ' ' +  xAnchorEnd   + ' ' +  yAnchorEnd;

			// path.setAttribute( 'd' , txt );
			// path.setAttribute( 'stroke' , '#0000FF' );
			// path.setAttribute( 'stroke-width' , 2.0 );
			// path.setAttribute( 'fill' , 'none' );

			return txt;
		}