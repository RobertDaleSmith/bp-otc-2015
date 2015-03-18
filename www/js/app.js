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




var pathStr = "M1031 325C1031 500 1271 530 1271 375";
var path = {

	X1 : 1031,
	Y1 : 325,
	Xc1: 1031,
	Yc1: 500,
	Xc2: 1271,
	Yc2: 530,
	X2: 1271,
	Y2: 375

}

pathStr = pathToStr(path);

function pathToStr(){
	return "M"+path.X1+" "+path.Y1+"C"+path.Xc1+" "+path.Yc1+" "+path.Xc2+" "+path.Yc2+" "+path.X2+" "+path.Y2+"";
}

var loop = null;
function play(){

  var bezier = new Bezier( path.X1, path.Y1, path.Xc1, path.Yc1, path.Xc2, path.Yc2, path.X2, path.Y2 );
  var length = parseInt(bezier.length());
  // .derivative(t)



  console.log("Curve length is " + length + "px");

	clearInterval(loop);

  var pps = 360;
  var fps = 45;

  var duration = ((length / pps) * 1000).round(0);
  var inc = ((1000/fps) / duration).round(4);

  
  var lambda = 0;
  var loopCount = 0;

  console.log("Needs to last " + duration + "ms");

  console.log("Increments percentage traveled by " + (inc*100).round(4) + "% " + fps + " times a second.");

	loop = setInterval(function(){

		lambda = lambda + inc;

    // 

    

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

		var arrowPos = posAlongCubicBezierCurve(lambda, path);
		$('#test_arrow').attr('cx', arrowPos.x).attr('cy', arrowPos.y);

    var tan = bezier.derivative(lambda);
    tan.x = parseInt(arrowPos.x) + tan.x;
    tan.y = parseInt(arrowPos.y) + tan.y;

    $('#test_tangent').attr('d', 'M'+arrowPos.x+' '+arrowPos.y+' '+tan.x+' '+tan.y);

    loopCount++;
		if(lambda >= 1) {
			clearInterval(loop);
      console.log("Took: " + ( parseInt(loopCount)*(1000/fps) ) + "ms at " + pps + "px/s");
		}
   
  },(1000/fps));

}


//****************************************************************************
 //
 //****************************************************************************

 function interpolateLinearBezierCurve(
                                       lambdaStart,
                                       lambdaEnd,
                                       xAnchorStart,
                                       yAnchorStart,
                                       xAnchorEnd,
                                       yAnchorEnd 
                                      ) {
  'use strict';

  var x0, y0, x1, y1, path, txt;

  if ( lambdaStart > 0.0 ) {
   xAnchorStart = xAnchorStart + lambdaStart * ( xAnchorEnd - xAnchorStart );
   yAnchorStart = yAnchorStart + lambdaStart * ( yAnchorEnd - yAnchorStart );
  }
  
  if ( lambdaEnd < 1.0 ) {
   xAnchorEnd = xAnchorStart + lambdaEnd * ( xAnchorEnd - xAnchorStart );
   yAnchorEnd = yAnchorStart + lambdaEnd * ( yAnchorEnd - yAnchorStart );
  }
  
  // path = document.createElementNS( nameSpace, 'path' );

  txt  = 'M' +  xAnchorStart + ' ' +  yAnchorStart;
  txt += ' ' +  xAnchorEnd + ' ' +  yAnchorEnd;

  // path.setAttribute( 'd' , txt );
  // path.setAttribute( 'stroke' , '#FF0000' );
  // path.setAttribute( 'stroke-width' , 2.0 );

  return txt;
 } 


 //****************************************************************************
 //
 //****************************************************************************

 function interpolateQuadraticBezierCurve(
                                          lambdaStart,
                                          lambdaEnd,
                                          xAnchorStart,
                                          yAnchorStart,
                                          xHandle,
                                          yHandle,
                                          xAnchorEnd,
                                          yAnchorEnd 
                                         ) {
  'use strict';

  var x0, y0, x1, y1, path, txt;

  if ( lambdaStart > 0.0 ) {
   x0 =  xAnchorStart + lambdaStart * ( xHandle    - xAnchorStart );
   y0 =  yAnchorStart + lambdaStart * ( yHandle    - yAnchorStart );
   x1 =  xHandle      + lambdaStart * ( xAnchorEnd - xHandle      );
   y1 =  yHandle      + lambdaStart * ( yAnchorEnd - yHandle      );

   xAnchorStart = x0 + lambdaStart * ( x1 - x0 );
   yAnchorStart = y0 + lambdaStart * ( y1 - y0 );
   xHandle      = x1;
   yHandle      = y1; 
  }

  if ( lambdaEnd < 1.0 ) {
   x0 =  xAnchorStart + lambdaEnd * ( xHandle    - xAnchorStart );
   y0 =  yAnchorStart + lambdaEnd * ( yHandle    - yAnchorStart );
   x1 =  xHandle      + lambdaEnd * ( xAnchorEnd - xHandle      );
   y1 =  yHandle      + lambdaEnd * ( yAnchorEnd - yHandle      );

   xHandle    = x0;
   yHandle    = y0;
   xAnchorEnd = x0 + lambdaEnd * ( x1 - x0 );
   yAnchorEnd = y0 + lambdaEnd * ( y1 - y0 );
  }
  
  // path = document.createElementNS( nameSpace, 'path' );

  txt  = 'M' + xAnchorStart + ' ' + yAnchorStart + ' ';
  txt += 'Q' + xHandle      + ' ' + yHandle      + ' ';
  txt +=       xAnchorEnd   + ' ' + yAnchorEnd;

  // path.setAttribute( 'd' , txt );
  // path.setAttribute( 'stroke' , '#00FF00' );
  // path.setAttribute( 'stroke-width' , 2.0 );
  // path.setAttribute( 'fill' , 'none' );

  return txt;
 }


 //****************************************************************************
 //
 //****************************************************************************

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

  txt  = 'M' +  xAnchorStart + ' ' +  yAnchorStart;
  txt += 'C' +  xHandleStart + ' ' +  yHandleStart;
  txt += ' ' +  xHandleEnd   + ' ' +  yHandleEnd  ;
  txt += ' ' +  xAnchorEnd   + ' ' +  yAnchorEnd;

  return txt;
 }

 function posAlongCubicBezierCurve( lambda, path ){

 	var pathStr = interpolateCubicBezierCurve( 0,
                                 lambda,
                                 path.X1,
                                 path.Y1,
                                 path.Xc1,
                                 path.Yc1,
                                 path.Xc2,
                                 path.Yc2,
                                 path.X2,
                                 path.Y2 
                                );

 	var parts = pathStr.split(" ");

 	return {x: parts[parts.length-2], y: parts[parts.length-1]};
 }

