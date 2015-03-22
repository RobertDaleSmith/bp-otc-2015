/**
	A javascript svg Arrow library by RobertDaleSmith.

	http://robertdalesmith.github.io/arrowjs

**/
(function() {
	"use strict";

	var svg = null;

	var pps = 360;

	var fps = 60;

	var utils = {

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

			return txt;

		},

		linLength: function(x1, y1, x2, y2){

			return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );

		},

		svgPathStrToPts: function(str){

			var pts = [], x = [], y = [];

			var vals = str.replaceAll('M ','').replaceAll('M','' )
						  .replaceAll('C ','').replaceAll('C',' ')
						  .split(' ');

			vals.forEach(function(val, i){

				val = parseFloat(val).round(0);

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

	};

	/**
	 * Arrow bezier line curve constructor. 
	 *
	 */
	var Arrow = function(section, color, index, path){

		if(!svg) svg = $('svg#arrow_paths')[0];

		var self = this;

		this.bezier = Bezier.fromSVG(path);	
		
		this.section = section;

		this.color = color;

		this.index = index;

		this.bMouseDragging = false;

		this.nMouseOffsetX = 0;

		this.nMouseOffsetY = 0;

		this.draggingEl = null;

		this.loop = null;
		
		this.group = $('#arrow_paths #lines_'+this.section+' .lines.'+this.color+' .line.line_'+this.index);
		
		this.group.find('g.curve, g.handles circle').dblclick( function(e){ self.play() } );

		this.group.find('g.curve').bind('mouseheld', function(e){ self.editToolToggle() } );

		this.group.find('g.handles circle').each(function(){

			this.addEventListener("mousedown", function(e){ self.mouseDown(e, this) }, false);
			this.addEventListener("mouseup"  , function(e){ self.mouseUp(  e, this) }, false);
			this.addEventListener("mousemove", function(e){ self.mouseMove(e, this) }, false);

			var whichPoint = $(this).attr('class')+'';
			if(whichPoint == 'start') $(this).attr('cx', self.bezier.points[0].x).attr('cy', self.bezier.points[0].y);
			if(whichPoint == 'ctr1')  $(this).attr('cx', self.bezier.points[1].x).attr('cy', self.bezier.points[1].y);
			if(whichPoint == 'ctr2')  $(this).attr('cx', self.bezier.points[2].x).attr('cy', self.bezier.points[2].y);
			if(whichPoint == 'end')	  $(this).attr('cx', self.bezier.points[3].x).attr('cy', self.bezier.points[3].y);

		});

		this.order = this.group.attr('order');

		self.reset();

	};

	Arrow.utils = utils;

	Arrow.prototype = {

		mouseDown: function(evt, element){

			var self = this;

			svg.addEventListener("mousemove", function(e){ self.mouseMove(e, (self.draggingEl || element)); }, false);
			
			this.bMouseDragging = true;

			var p = svg.createSVGPoint();
				p.x = evt.clientX;
				p.y = evt.clientY;

			var m = element.getScreenCTM();
				p = p.matrixTransform(m.inverse());

			this.nMouseOffsetX = p.x - parseInt( element.getAttribute("cx") );
			this.nMouseOffsetY = p.y - parseInt( element.getAttribute("cy") );

			this.draggingEl = element;

			if( $(element).attr('class') =='start' || $(element).attr('class') =='end' ) $(element).attr('stroke-width','1');
		},

		mouseMove: function(e, element){

			var p = svg.createSVGPoint();
				p.x = e.clientX;
				p.y = e.clientY;

			var m = element.getScreenCTM();
				p = p.matrixTransform(m.inverse());

			if(this.bMouseDragging) {

				this.group.find('g.guides path.base').attr('stroke','LIGHTGREY');
				
				var pos = {x: p.x - this.nMouseOffsetX, y: p.y - this.nMouseOffsetY};

				element.setAttribute("cx", pos.x);
				element.setAttribute("cy", pos.y);

				var whichPoint = $(this.draggingEl).attr('class');

				if(whichPoint == 'start') this.bezier.points[0] = {x: pos.x, y: pos.y};
				if(whichPoint == 'ctr1')  this.bezier.points[1] = {x: pos.x, y: pos.y};
				if(whichPoint == 'ctr2')  this.bezier.points[2] = {x: pos.x, y: pos.y};
				if(whichPoint == 'end')	  this.bezier.points[3] = {x: pos.x, y: pos.y};

				this.bezier.update();

				this.updateGuideLines();

			}

		},

		mouseUp: function(evt, element){
			
			this.bMouseDragging = false;

			this.draggingEl = null;

			this.group.find('g.guides path.base').attr('stroke','transparent');

			if( $(element).attr('class') =='start' || 
				$(element).attr('class') =='end' ) 
				$(element).attr('stroke-width','0');

			this.update();

			$(svg).unbind();

		},

		updateGuideLines: function(){

			this.group.find('g.guides path.base'  ).attr('d', this.bezier.toSVG() );
			this.group.find('g.guides path.guide1').attr('d', utils.ptsToSvgPathStr( [ this.bezier.points[1], this.bezier.points[0] ]) );
			this.group.find('g.guides path.guide2').attr('d', utils.ptsToSvgPathStr( [ this.bezier.points[2], this.bezier.points[3] ]) );
			this.group.find('g.guides path.guide3').attr('d', utils.ptsToSvgPathStr( [ this.bezier.points[1], this.bezier.points[2] ]) );

		},
	
		play: function(cb){
			
			var self = this;

			

			var length = this.bezier.length();
			var duration = (length / pps) * 1000;
			var inc = ((1000/fps) / duration);

			var lambda = 0;
			var loopCount = 0;

			clearInterval(self.loop);

			self.loop = setInterval(function(){

				lambda = (lambda + inc);

				if(lambda > 1) lambda = 1;

				self.render(lambda);

				loopCount++;

				if(lambda >= 1) {
					clearInterval(self.loop);
					if(cb) cb();
				}

			}, (1000/fps) );

		},

		render: function(lambda){

			var newPathStr = utils.interpolateCubicBezierCurve(0, lambda, this.bezier.points);

			var newPath = Bezier.fromSVG(newPathStr);

			var arrowPos = newPath.points[newPath.points.length-1];

			var tan   = this.bezier.derivative(lambda);
				tan.x = parseInt(arrowPos.x) + tan.x;
				tan.y = parseInt(arrowPos.y) + tan.y;

			var degrees = ((Math.atan2(tan.y - arrowPos.y, tan.x - arrowPos.x) * 180 / Math.PI) + 90) || 0;

			this.group.find('g.curve path.lambda').attr('d', newPathStr);

			this.group.find('g.curve polygon.arrow').attr('transform', "translate(" + (arrowPos.x-13) + "," + (arrowPos.y-14) + ") rotate(" + degrees + " 13 14)");

			if(lambda == 0) this.group.find('g.curve polygon.arrow').attr('display','none');
			else this.group.find('g.curve polygon.arrow').attr('display','');

			// this.group.find('g.guides path.tangent').attr('d', 'M'+arrowPos.x+' '+arrowPos.y+' '+tan.x+' '+tan.y);

			// this.group.find('g.guides circle.head').attr('cx', arrowPos.x).attr('cy', arrowPos.y);

		},

		reset: function(){

			this.render(0);

			this.updateGuideLines();

		},

		update: function(){

			this.render(1);

		},

		editToolToggle: function(){

			var className = this.group.attr('class');

			if( className.contains('edit') ){

				className = className.remove(' edit');

				var jsonStr='{ section: "' + this.section + 
							'", color: "'  + this.color   + 
							'", index: '   + this.index   + 
							',  path: "'   + this.bezier.toSVG() + 
							'" }';

				console.log(jsonStr);

			} else {
			
				className = className + ' edit';
			
			}

			this.group.attr('class', className);

		}

	};

	if(typeof module !== "undefined" && module.exports) {
		module.exports = Arrow;
	}

	else if(typeof define !== "undefined") {
		define(function() { return Arrow; });
	}

	else if(typeof window !== "undefined") {
		window.Arrow = Arrow;
	}

}());