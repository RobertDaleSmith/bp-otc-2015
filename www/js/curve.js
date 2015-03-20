
(function() {

	"use strict";

	var bezier = null;

	var bMouseDragging = false;

	var nMouseOffsetX = 0;

	var nMouseOffsetY = 0;

	var draggingEl = null;

	var SVGWrapper = null;

	var group = null;

	var loop = null;

	var Curve = function(sectionId, colorStr, indexInt, pathStr){
		
		this.section = sectionId;

		this.color = colorStr;

		this.index = indexInt;

		SVGWrapper = $('svg#arrow_paths')[0];

		bezier = new Bezier( svgPathStrToPts(pathStr) );

		//render view before connecting handlers...
		var curveData = {
			section: sectionId,
			color: colorStr,
			index: indexInt,			
			paths: {
				base:   "M1031 325C1031 500 1271 530 1271 375",
				guide1: "M1031 500 1031 325",
				guide2: "M1271 530 1271 375",
				guide3: "M1031 500 1271 530"
			},
			points: {
				arrow: {x:1258,y:361},
				start: {x:1031,y:325},
				end:   {x:1271,y:375},
				ctr1:  {x:1031,y:500},
				ctr2:  {x:1271,y:530}
			}
		}


		// BP.views.render('curveSection', {section: "asi"}, function(html){

			// $('svg#arrow_paths').append(html);

			// BP.views.render('curveGroup', {color: colorStr}, function(html){

				// $('#lines_'+sectionId).append(html);

				// BP.views.render('curveLine', curveData, function(html){

				// 	$('#lines_'+sectionId+' .lines.'+colorStr).append(html);

				// });

			// });

		// });

		

		BP.views.render('svg', curveData, function(html){
					
			$('#map_content_wrapper').append(html);

			SVGWrapper = $('svg#arrow_paths')[0];

			group = $('#arrow_paths #lines_'+sectionId+' .lines.'+colorStr+' .line.line_'+indexInt);

			group.find('g.handles circle').each(function(){
				this.addEventListener("mousedown", function(e){ mouseDown(e, this); }, false);
				this.addEventListener("mouseup"  , function(e){ mouseUp(e, this); }, false);
				this.addEventListener("mousemove", function(e){ mouseMove(e, (draggingEl || this)); }, false);
			});

		});


		

	};

	var mouseDown = function(evt, element){

		SVGWrapper.addEventListener("mousemove", function(e){ mouseMove(e, (draggingEl || this)); }, false);
		
		bMouseDragging = true;

		var p = SVGWrapper.createSVGPoint();
		p.x = evt.clientX;
		p.y = evt.clientY;

		var m = element.getScreenCTM();
		p = p.matrixTransform(m.inverse());

		nMouseOffsetX = p.x - parseInt( element.getAttribute("cx") );
		nMouseOffsetY = p.y - parseInt( element.getAttribute("cy") );

		draggingEl = element;

		if( $(element).attr('class') =='start' || $(element).attr('class') =='end' ) $(element).attr('stroke-width','1');

	};

	var mouseMove = function(e, element){

		var p = SVGWrapper.createSVGPoint();
			p.x = e.clientX;
			p.y = e.clientY;

		var m = element.getScreenCTM();
		p = p.matrixTransform(m.inverse());
		// console.log('('+p.x+', '+p.y+')');

		if(bMouseDragging) {

			group.find('g.guides path.base').attr('stroke','LIGHTGREY');
			
			var pos = {x: p.x - nMouseOffsetX, y: p.y - nMouseOffsetY};
			element.setAttribute("cx", pos.x);
			element.setAttribute("cy", pos.y);

			//do something
			var whichPoint = $(draggingEl).attr('class');
			// console.log( whichPoint );
			if(whichPoint == 'start'){

				bezier.points[0].x = pos.x;
				bezier.points[0].y = pos.y;

			}

			if(whichPoint == 'ctr1'){

				bezier.points[1].x = pos.x;
				bezier.points[1].y = pos.y;

			}

			if(whichPoint == 'ctr2'){

				bezier.points[2].x = pos.x;
				bezier.points[2].y = pos.y;

			}

			if(whichPoint == 'end'){

				bezier.points[3].x = pos.x;
				bezier.points[3].y = pos.y;

			}

			bezier.update();

			group.find('g.guides path.base').attr('d', bezier.toSVG());

			// console.log(ptsToSvgPathStr( [ bezier.points[1], bezier.points[0] ]));
			group.find('g.guides path.guide1').attr('d', ptsToSvgPathStr( [ bezier.points[1], bezier.points[0] ]) );
			group.find('g.guides path.guide2').attr('d', ptsToSvgPathStr( [ bezier.points[2], bezier.points[3] ]) );
			group.find('g.guides path.guide3').attr('d', ptsToSvgPathStr( [ bezier.points[1], bezier.points[2] ]) );
		}

	};

	var mouseUp = function(evt, element){
		
		bMouseDragging = false;

		draggingEl = null;

		group.find('g.guides path.base').attr('stroke','transparent');

		if( $(element).attr('class') =='start' || 
			$(element).attr('class') =='end' ) 
			$(element).attr('stroke-width','0');

		play();

		$(SVGWrapper).unbind();

	};

	var svgPathStrToPts = function(str){

		var pts = [], x = [], y = [];

		var vals = str.replaceAll('M','').replaceAll('C',' ').split(' ');

		vals.forEach(function(val, i){

			val = parseFloat(val).round(0);

			if(i%2==0 || i==0) x.push(val); else y.push(val);

		});

		var count = ((x.length <= y.length) ? x.length : y.length);
		for(var i=0; i<count; i++) pts.push( {x:x[i], y:y[i]} );

		return pts;

	};

	var ptsToSvgPathStr = function(points){

		var str = "";

		points.forEach(function(point, i){

			if(i==0) str+="M";
			else if(i==1 && points.length > 2) str+="C";
			else str+=" ";

			str = str + point.x + " " + point.y;

		});

		return str;

	};

	var play = function(){
		
		var length = bezier.length();

		var str = bezier.toSVG();
		var pts = svgPathStrToPts(str);

		var pps = 720;
		var fps = 60;

		var duration = (length / pps) * 1000;
		var inc = ((1000/fps) / duration);

		var lambda = 0;
		var loopCount = 0;

		// console.log("Needs to last " + duration + "ms");
		// console.log("Increments percentage traveled by " + (inc*100) + "% " + fps + " times a second.");

		clearInterval(loop);

		loop = setInterval(function(){

			lambda = (lambda + inc);

			if(lambda > 1) lambda = 1;

			render(lambda);

			loopCount++;

			if(lambda >= 1) {
				// console.log("Took: " + ( parseInt(loopCount)*(1000/fps) ) + "ms at " + pps + "px/s");
				clearInterval(loop);
			}

		}, (1000/fps) );


		console.log(str);

	};

	var render = function(lambda){

		var newPathStr = interpolateCubicBezierCurve(0, lambda, bezier.points);
			
		var newPathPts = svgPathStrToPts(newPathStr);

		var arrowPos = newPathPts[newPathPts.length-1];

		var tan   = bezier.derivative(lambda);
			tan.x = parseInt(arrowPos.x) + tan.x;
			tan.y = parseInt(arrowPos.y) + tan.y;

		var degrees = ((Math.atan2(tan.y - arrowPos.y, tan.x - arrowPos.x) * 180 / Math.PI) + 90) || 0;

		group.find('g.curve path.lambda').attr('d', newPathStr);

		group.find('g.curve polygon.arrow').attr('transform', "translate(" + (arrowPos.x-13) + "," + (arrowPos.y-14) + ") rotate(" + degrees + " 13 14)");

		if(lambda == 0) group.find('g.curve polygon.arrow').attr('display','none');
		else group.find('g.curve polygon.arrow').attr('display','');

		// group.find('g.guides path.tangent').attr('d', 'M'+arrowPos.x+' '+arrowPos.y+' '+tan.x+' '+tan.y);

		// group.find('g.guides circle.head').attr('cx', arrowPos.x).attr('cy', arrowPos.y);

	};

	var interpolateLinearBezierCurve = function( lambdaStart, lambdaEnd, points ){
		
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

	};

	var interpolateQuadraticBezierCurve = function (lambdaStart, lambdaEnd, points) {
		
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

	};

	var interpolateCubicBezierCurve = function(lambdaStart, lambdaEnd, points) {

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

	};

	var posAlongCubicBezierCurve = function( lambda, points ){

		var pathStr = this.interpolateCubicBezierCurve( 0, lambda, points);

		var parts = pathStr.split(" ");

		return {x: parseInt(parts[parts.length-2]), y: parseInt(parts[parts.length-1])};

	};

	var linLength = function(x1, y1, x2, y2){

		return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );

	};

	// Public methods.
	Curve.prototype = {
		
		play: function() {
			play();
			return;
		},

	};

	if(typeof module !== "undefined" && module.exports) {
		module.exports = Curve;
	}

	else if(typeof define !== "undefined") {
		define(function() { return Curve; });
	}

	else if(typeof window !== "undefined") {
		window.Curve = Curve;
	}

}());