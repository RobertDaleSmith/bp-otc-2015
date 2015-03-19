BP.curves = {

	bezier: null,
	pathStr: "M1031 325C1031 500 1271 530 1271 375",
	bMouseDragging: false,
	nMouseOffsetX: 0,
	nMouseOffsetY: 0,
	draggingEl: null,

	init: function(){

		BP.curves.bezier = new Bezier( this.svgPathStrToPts(this.pathStr) );

		$('#arrow_paths_wrapper circle').each(function(){
			this.addEventListener("mousedown", BP.curves.mouseDown, false);
			this.addEventListener("mouseup", BP.curves.mouseUp, false);
			this.addEventListener("mousemove", BP.curves.mouseMove, false);
		});
		$('svg#arrow_paths_wrapper')[0].addEventListener("mousemove", BP.curves.mouseMove, false);

	},

	mouseDown: function(e){
		
		var self = this;

		BP.curves.bMouseDragging = true;

		var p = $('svg#arrow_paths_wrapper')[0].createSVGPoint();
		p.x = e.clientX;
		p.y = e.clientY;

		var m = self.getScreenCTM();
		p = p.matrixTransform(m.inverse());
		nMouseOffsetX = p.x - parseInt( self.getAttribute("cx") );
		nMouseOffsetY = p.y - parseInt( self.getAttribute("cy") );

		BP.curves.draggingEl = this;

		if( $(this).attr('class') =='start' || $(this).attr('class') =='end' ) $(this).attr('stroke-width','1');

	},

	mouseMove: function(e){

		var self = BP.curves.draggingEl || this;

		var p = $('svg#arrow_paths_wrapper')[0].createSVGPoint();
			p.x = e.clientX;
			p.y = e.clientY;

		var m = self.getScreenCTM();
		p = p.matrixTransform(m.inverse());
		// console.log('('+p.x+', '+p.y+')');
		// console.log(p);

		if(BP.curves.bMouseDragging) {

			$('#test_path').attr('stroke','LIGHTGREY');
			
			var pos = {x: p.x - nMouseOffsetX, y: p.y - nMouseOffsetY};
			self.setAttribute("cx", pos.x);
			self.setAttribute("cy", pos.y);

			//do something
			var whichPoint = $(BP.curves.draggingEl).attr('class');
			// console.log( whichPoint );
			if(whichPoint == 'start'){

				BP.curves.bezier.points[0].x = pos.x;
				BP.curves.bezier.points[0].y = pos.y;

			}

			if(whichPoint == 'ctr1'){

				BP.curves.bezier.points[1].x = pos.x;
				BP.curves.bezier.points[1].y = pos.y;

			}

			if(whichPoint == 'ctr2'){

				BP.curves.bezier.points[2].x = pos.x;
				BP.curves.bezier.points[2].y = pos.y;

			}

			if(whichPoint == 'end'){

				BP.curves.bezier.points[3].x = pos.x;
				BP.curves.bezier.points[3].y = pos.y;

			}

			BP.curves.bezier.update();

			$('#test_path').attr('d', BP.curves.ptsToSvgPathStr(BP.curves.bezier.points));

			// console.log(BP.curves.ptsToSvgPathStr( [ BP.curves.bezier.points[1], BP.curves.bezier.points[0] ]));
			$('#test_guide1').attr('d', BP.curves.ptsToSvgPathStr( [ BP.curves.bezier.points[1], BP.curves.bezier.points[0] ]) );
			$('#test_guide2').attr('d', BP.curves.ptsToSvgPathStr( [ BP.curves.bezier.points[2], BP.curves.bezier.points[3] ]) );
			$('#test_guide3').attr('d', BP.curves.ptsToSvgPathStr( [ BP.curves.bezier.points[1], BP.curves.bezier.points[2] ]) );
		}

	},

	mouseUp: function(e){
		
		BP.curves.bMouseDragging = false;

		draggingEl = null;

		$('#test_path').attr('stroke','transparent');
		if( $(this).attr('class') =='start' || $(this).attr('class') =='end' ) $(this).attr('stroke-width','0');

		BP.curves.play();

	},

	svgPathStrToPts: function(str){

		var pts = [], x = [], y = [];

		var vals = str.replaceAll('M','').replaceAll('C',' ').split(' ');

		vals.forEach(function(val, i){

			val = parseFloat(val).round(0);

			// val = parseInt(val);

			if(i%2==0 || i==0) x.push(val); else y.push(val);

		});

		var count = ((x.length <= y.length) ? x.length : y.length);
		for(var i=0; i<count; i++) pts.push( {x:x[i], y:y[i]} );

		return pts;

	},

	ptsToSvgPathStr: function(points){

		var str = "";

		points.forEach(function(point, i){

			if(i==0) str+="M";
			else if(i==1 && points.length > 2) str+="C";
			else str+=" ";

			str = str + point.x + " " + point.y;

		});

		return str;

	},

	loop: null,

	play: function(){
		
		var length = BP.curves.bezier.length();
		// console.log(length);

		var str = BP.curves.ptsToSvgPathStr(BP.curves.bezier.points)
		var pts = BP.curves.svgPathStrToPts(str);

		var pps = 720;
		var fps = 60;

		var duration = (length / pps) * 1000;
		var inc = ((1000/fps) / duration);

		var lambda = 0;
		var loopCount = 0;
		var maxLambda = 1;

		// maxLambda = 1 - ( 15 / length);
		// console.log( maxLambda );
		// console.log("Needs to last " + duration + "ms");
		// console.log("Increments percentage traveled by " + (inc*100) + "% " + fps + " times a second.");

		clearInterval(BP.curves.loop);

		BP.curves.loop = setInterval(function(){

			lambda = (lambda + inc);

			if(lambda >= maxLambda) lambda = maxLambda;

			var newPathStr = BP.curves.interpolateCubicBezierCurve(0, lambda, BP.curves.bezier.points);
			
			var newPathPts = BP.curves.svgPathStrToPts(newPathStr);

			var arrowPos = newPathPts[newPathPts.length-1];

			var tan   = BP.curves.bezier.derivative(lambda);
				tan.x = parseInt(arrowPos.x) + tan.x;
				tan.y = parseInt(arrowPos.y) + tan.y;

			var degrees = ((Math.atan2(tan.y - arrowPos.y, tan.x - arrowPos.x) * 180 / Math.PI) + 90) || 0;

			

			$('#test_lambda').attr('d', newPathStr);

			$('#test_tangent').attr('d', 'M'+arrowPos.x+' '+arrowPos.y+' '+tan.x+' '+tan.y);
			
			$('#test_head').attr('cx', arrowPos.x).attr('cy', arrowPos.y);

			$('#test_arrow').attr('transform', "translate(" + (arrowPos.x-13) + "," + (arrowPos.y-14) + ") rotate(" + degrees + " 13 14)");

			loopCount++;
			if(lambda >= maxLambda) {
				clearInterval(BP.curves.loop);
				// console.log("Took: " + ( parseInt(loopCount)*(1000/fps) ) + "ms at " + pps + "px/s");
			}

		},(1000/fps));

	},

	interpolateLinearBezierCurve: function( lambdaStart, lambdaEnd, points ){
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

		txt  = 'M' +  xAnchorStart + ' ' +  yAnchorStart;
		txt += ' ' +  xAnchorEnd + ' ' +  yAnchorEnd;

		return txt;
	},

	interpolateQuadraticBezierCurve: function (lambdaStart, lambdaEnd, points) {
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

		txt  = 'M' + xAnchorStart + ' ' + yAnchorStart + ' ';
		txt += 'Q' + xHandle      + ' ' + yHandle      + ' ';
		txt +=       xAnchorEnd   + ' ' + yAnchorEnd;

		return txt;
	},

	interpolateCubicBezierCurve: function(lambdaStart, lambdaEnd, points) {

		'use strict';

		var xAnchorStart = points[0].x, yAnchorStart = points[0].y,
			xHandleStart = points[1].x, yHandleStart = points[1].y,
			xHandleEnd   = points[2].x, yHandleEnd   = points[2].y,
			xAnchorEnd   = points[3].x, yAnchorEnd   = points[3].y;

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

		// console.log(txt);

		return txt;

	},

	posAlongCubicBezierCurve: function( lambda, points ){

		var pathStr = BP.curves.interpolateCubicBezierCurve( 0, lambda, points);

		var parts = pathStr.split(" ");

		return {x: parseInt(parts[parts.length-2]), y: parseInt(parts[parts.length-1])};

	},

	linLength: function(x1, y1, x2, y2){

		return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );

	}

}