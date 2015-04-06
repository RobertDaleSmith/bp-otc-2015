BP.handlers = {

	init: function() {

		$('div#logo_wrapper').click(this.headerLogoClickEvent);

		$('div#header_button_wrapper .btn .title').click(this.headerMainMenuClickEvent);

		$('div#header_button_wrapper .btn .icon').click(this.headerDropDownMenuClickEvent);

		$('div.menuItem').click(this.headerMenuItemClickEvent);

		$('.sub_menu_wrapper .menu .btn').click(this.subMenuClickEvent);

		$('div#deployments div.mapPoint').click(this.mapPointClickEvent);

		$('div#deployments div.mapPoint .close').click(this.mapPointLabelCloseBtnClickEvent);

		$('div.listGroup div.title, div.listGroup div.toggle').click(this.techCategoryToggleClickEvent);

		$('div#mapImage').click(this.mapClickEvent);

		if(BP.settings.editMode){
			$('div#projects div.mapPoint div.label').each(function(){

				this.addEventListener("mousedown", function(e){ BP.handlers.tools.labels.mouseDown(e, this) }, false);
				this.addEventListener("mouseup"  , function(e){ BP.handlers.tools.labels.mouseUp(  e, this) }, false);
				this.addEventListener("mousemove", function(e){ BP.handlers.tools.labels.mouseMove(e, this) }, false);

			});
		}

		this.keyboardKeyEventsInit();

		this.videoPlayerInit();

	},

	tools:{

		labels: {

			isDown: false,

			elDragging: null,

			start: {x:0, y:0},

			elPos: {x:0, y:0},

			mouseDown: function(e, element){
				
				if( e.which == 1 ){

					this.isDown = true;
					this.elDragging = element;
					this.start = {x: e.clientX, y: e.clientY};
					this.elPos = {x: parseInt($(this.elDragging).css('left').replace('px','')),
								  y: parseInt($(this.elDragging).css('top' ).replace('px',''))};

					
					if(!this.elPos.x) this.elPos.x = parseInt($(this.elDragging).css('right').replace('px',''));
					
					$('#mapImage')[0].addEventListener("mousemove", function(e){ BP.handlers.tools.labels.mouseMove(e, this) }, false);
					$('#mapImage')[0].addEventListener("mouseup"  , function(e){ BP.handlers.tools.labels.mouseUp(  e, this) }, false);

					$(this.elDragging).addClass('dragging');

				}
				
			},

			mouseMove: function(e, element){ if(this.isDown){ 		
				
				var direction = "NE", left = false, under = false;;
				var dirSelector = $(this.elDragging).parent().parent().attr('class').replace('mapPoint ','');

				if(dirSelector.indexOf("left" ) > -1) left  = true;
				if(dirSelector.indexOf("under") > -1) under = true;

				if( left &&  under) direction = "SW"; else 
				if( left && !under) direction = "NW"; else 
				if(!left &&  under) direction = "SE";
				
				var diff = { x:e.clientX-this.start.x, y:e.clientY-this.start.y };
				var newPos = { x:(this.elPos.x + diff.x), y:(this.elPos.y + diff.y) };
				if(direction == "NW" || direction == "SW") newPos.x = (this.elPos.x - diff.x);

				this.updatePosition(element, newPos);
								
			}},

			mouseUp: function(e, element){
				if(this.elDragging){
					var top = parseInt( $(this.elDragging).css('top')+"".replace('px','') ),
					   left = parseInt( $(this.elDragging).css('left')+"".replace('px','') ),
					  right = parseInt( $(this.elDragging).css('right')+"".replace('px','') ),
						loc = {top:top};

					if(left) loc.left  = left; else 
					if(right)loc.right = right;
					console.log(loc);
				}

				$(this.elDragging).removeClass('dragging');

				this.isDown = false;
				this.elDragging = false;
				this.start = {x:0, y:0};
				this.elPos = {x:0, y:0};

				$('#mapImage').unbind();

			},

			updatePositions: function(){

				var self = this;

				$('.points#projects .mapPoint .label_wrapper .label').each(function(){ 

					var pos = { x: parseInt($(this).css('left').replace('px','')),
							 	y: parseInt($(this).css('top' ).replace('px','')) };
					
					if(!pos.x) pos.x = parseInt($(this).css('right').replace('px',''));

					self.updatePosition(this, pos);

				});

			},

			updatePosition: function(element, newPos){

				var direction = "NE", left = false, under = false;;
				var dirSelector = $(element).parent().parent().attr('class').replace('mapPoint ','');

				if(dirSelector.indexOf("left" ) > -1) left  = true;
				if(dirSelector.indexOf("under") > -1) under = true;

				if( left &&  under) direction = "SW"; else 
				if( left && !under) direction = "NW"; else 
				if(!left &&  under) direction = "SE";

				if(direction == "NE"){

					// Calc Max/Mins
					if(newPos.x <=  30) newPos.x =   30; else 
					if(newPos.x >  120) newPos.x =  120;
					if(newPos.y >= -22) newPos.y =  -22; else 
					if(newPos.y < -120) newPos.y = -120;
					
					// Update CSS
					$(element).parent().find('.arrow')
						.css('height', (newPos.y * -1) + 15)
						.css('width' ,  newPos.x - 15)
					;
					$(element).parent().find('.stats').css('left', newPos.x).css('top', newPos.y+37);
					$(element).css('left', newPos.x).css('top', newPos.y);															

				} else 
				if(direction == "SE"){
					
					// Calc Max/Mins
					if(newPos.x <=  30) newPos.x =  30; else 
					if(newPos.x >  120) newPos.x = 120;
					if(newPos.y >= 120) newPos.y = 120; else 
					if(newPos.y <   15) newPos.y =  15;
					
					// Update CSS
					$(element).parent().find('.arrow')
						.css('-webkit-clip-path' , "polygon(0 0, 100% 100%, 100% " + (newPos.y + 22 - 37) + "px)")
						.css('height', newPos.y + 22)
						.css('width' , newPos.x - 15)
					;
					$(element).parent().find('.stats').css('left', newPos.x).css('top', newPos.y+37);
					$(element).css('left', newPos.x).css('top', newPos.y);

				} else 
				if(direction == "NW"){

					// Calc Max/Mins
					if(newPos.x <=  30) newPos.x =   30; else 
					if(newPos.x >  120) newPos.x =  120;
					if(newPos.y >= -23) newPos.y =  -23; else 
					if(newPos.y < -120) newPos.y = -120;
					
					// Update CSS
					$(element).parent().find('.arrow').css('height', (newPos.y * -1) + 15).css('width' , newPos.x - 15);
					$(element).parent().find('.stats').css('right', newPos.x).css('top', newPos.y+37);
					$(element).css('top', newPos.y).css('right', newPos.x);
					
				} else 
				if(direction == "SW"){

					// Calc Max/Mins
					if(newPos.x <=  30) newPos.x =  30; else 
					if(newPos.x >  120) newPos.x = 120;
					if(newPos.y >= 120) newPos.y = 120; else 
					if(newPos.y <   15) newPos.y =  15;
					
					// Update CSS
					$(element).parent().find('.arrow')
						.css('-webkit-clip-path' , "polygon(0 " + (newPos.y + 22 - 37) + "px, 100% 0, 0 100%)")
						.css('height', newPos.y + 22)
						.css('width' , newPos.x - 15)
					;
					$(element).parent().find('.stats').css('right', newPos.x).css('top', newPos.y+37);
					$(element).css('top', newPos.y).css('right', newPos.x);
					
				}

			}

		}

	},

	subMenuClickEvent: function() {

		window.clearInterval(BP.timers.arrowDelay);

		window.clearInterval(BP.timers.sequenceDelay);

		var self = this;

		var id = $(self).attr('id');

		var projectId = $(self).parent().attr('id');

		var active = $(self).hasClass('active');

		var anyActive = false;
		$(self).parent().find('.btn').each(function(btn){
			
			var hasClass = $(this).hasClass('active');
			if(hasClass) anyActive = true;
			if(active) anyActive = false;
			
		});

		if(anyActive && !active){
			// Resets all arrows to lambda 0.
			BP.handlers.resetAllArrows();
		}

		var project = $(self).parent().attr("id");

		var color = $(self).attr('class') || "";
			color = color.replace('btn ','').replace(' active','') || 'none';

		var activePoints = [], inactivePoints = [];

		var hasStartPt = false;

		$('.sub_details .item').removeClass('active');

		if(!active){

			// Not active, so activate it.

			$('div#projects div.project#' + projectId + ' div.mapPoint').each(function(){

				if( $(this).attr('color').contains(color) )
					activePoints.push(this);
				else
					inactivePoints.push(this);
				
			});

			$(activePoints).each(function(){

				$(this).removeClass('green').removeClass('blue').removeClass('orange').removeClass('purple').addClass(color);
				$(this).removeClass('inactive');
				
			});

			$(inactivePoints).each(function(){

				$(this).removeClass('green').removeClass('blue').removeClass('orange').removeClass('purple');
				
				if(color != 'none')
					$(this).addClass('inactive');
				else
					$(this).removeClass('inactive');

			});

			// Hide/show sub_details_wrapper.
			$('div.sub_details_wrapper#' + projectId + ' div.sub_details').removeClass('active');
			$('div.sub_details_wrapper#' + projectId + ' div.sub_details.'+color).addClass('active');

			// Submenu btn active state toggle.
			$('div.sub_menu_wrapper .menu .btn').removeClass('active');
			$('div.sub_menu_wrapper#' + projectId + ' .menu .btn.'+color).addClass('active');

			// Manual Sequences
			$('div.mapPoint').removeClass('start');

			// Section's sequences.
			var sequences = BP.arrows[project][color];

			// Extends section post.
			if( !sequences.start || sequences.start == "")
				 sequences.start = "none";
			else hasStartPt = true;
			
			$('div.points#projects div.mapPoint#'+sequences.start).addClass('start');

			var time = 750; if(!hasStartPt) time = 100;
			
			// Delays start of sequence until post is extended.
			window.clearInterval(BP.timers.sequences);
			BP.timers.sequences = setTimeout(function(){
				
				var sequencesLoop = function(count){

					if(count >= sequences.length) return;
					
					//Open corresponding footer description.
					// console.log(sequences[count].name);
					$('.sub_details .item#'+sequences[count].name).addClass('active');

					var delay = 250; if(count == 0) delay = 0;

					window.clearInterval(BP.timers.sequenceDelay);
					BP.timers.sequenceDelay = setTimeout(function(){

						BP.handlers.playSequence(sequences[count].arrows, function(){ sequencesLoop(count+1) });

					},delay);

				}
				sequencesLoop(0);

			},time);
				

		} else {

			window.clearInterval(BP.timers.sequences);

			$('div.sub_menu_wrapper .menu .btn').removeClass('active');

			$('div.mapPoint').removeClass('start')
							 .removeClass('inactive')
							 .removeClass('green')
							 .removeClass('blue')
							 .removeClass('orange')
							 .removeClass('purple');

			BP.handlers.resetAllArrows();

		}

	},

	playSequence: function(arrows, cb) {

		var steps = [];

		arrows.forEach(function(a, i){ 
				
			if(!steps[a.order]) steps[a.order] = [];
			
			steps[a.order].push(i);
		
		});

		var o = 1, i = 0, m = 0;
		
		var seq = function() {
			
			if(o >= steps.length) { return cb('fin'); }

			var asyncs = [];

			for(var n=0; n<steps[o].length; n++){

				asyncs.push(function(next){

					var idx = steps[o][m];

					arrows[idx].play(function(){ 
						i++;

						BP.timers.arrowDelay = setTimeout(function(){ next(); }, 250);
					});

					m++;

				});

			}

			async.parallel(asyncs, function(){

				// console.log('async steps done');
				
				o++; m = 0;
				
				seq();

			});

		}

		seq();

	},

	resetAllArrows: function() {

		for (var key in BP.arrows) {
			var project = BP.arrows[key];
			for (var key in project) {
				var section = project[key];
				for (var key in section) if( key != 'start' ) {
					var sequence = section[key];
					for (var idx in sequence.arrows) {
						sequence.arrows[idx].reset();
					}
				}
			}
		}

	},

	keyboardKeyEventsInit: function() {

		$(window).on('keyup',function(e){
		
			// console.log(e.keyCode);

			if(e.keyCode == 27){ //esc
				
				if(gui){

					gui.App.quit();
					
				} else {

					if( $('div#header_wrapper .btn.open').length > 0 ){

						// Close any open header menu buttons.
						$('div#header_button_wrapper .btn.open .icon').click();

					} else if ( $('div.mapPoint.open').length > 0 ) {

						// Close any open mapPoints.
						$('div.mapPoint.open').find('.close').click();

					} else {


					}

				}

			}


		});

	},

	videoPlayerInit: function(){

		videojs("introVideo").ready(function(){ BP.player = this; });

	},

	headerLogoClickEvent: function(event) {

		if($("#intro_wrapper").css('display') == 'none'){

			// Shows intro video.
			$("#intro_wrapper").css('display','');

			// Resets & hides everything else.
			$('div.sub_details_wrapper div.sub_details').removeClass('active');
			$('.btn#projects .menuItem.active').removeClass('active');
			$('div#map_canvas').css('left', '0px').css('top', '0px');
			$("#header_button_wrapper .btn").removeClass('active');
			$('div.sub_details_wrapper').removeClass('active');
			$('div.sub_menu_wrapper').removeClass('open');
			$('div#footer_wrapper').removeClass('on');
			$('svg#arrow_paths').attr('class','');
			$("div.mapPoint").addClass('hide');
			$('div#footer_wrapper').text('');
			$('div.mapPoint.open').find('.close').click();

			// Start intro video.
			BP.player.play();

		}

		// Increments count to check for refresh request.
		BP.counters.refreshRequest++;
		if(BP.counters.refreshRequest == 5){ console.log('refresh page'); window.location.reload(); }
		window.clearInterval(BP.timers.refreshRequest);
		BP.timers.refreshRequest = setTimeout(function(){ BP.counters.refreshRequest = 0; }, 5000);
		
	},

	headerMainMenuClickEvent: function(event) {

		BP.player.load();

		window.clearInterval( BP.timers.arrowDelay );

		var self = this;

		var sectionId = $(self).parent().attr('id');

		if(sectionId == "deployments") $('.btn#projects .menuItem.active').removeClass('active');

		var isActive = false;
			isActive = $(self).parent().hasClass('active');

		if(!isActive){

			$('div.mapPoint.open').find('.close').click();
			
			$("#header_button_wrapper .btn").removeClass('active');

			$(self).parent().addClass('active');
			
			$("#intro_wrapper").css('display','none');
			
			$("div.mapPoint").addClass('hide');

			$("div.mapPoint div.label_wrapper").addClass('hide');

			if(sectionId == 'deployments') {
				
				$('div.sub_menu_wrapper').removeClass('open');

				$('div#map_canvas').css('left', '0px').css('top', '0px');
				BP.views.revealMapPoints('deployments');

				$('div.sub_details_wrapper').removeClass('active');
				$('div.sub_details_wrapper div.sub_details').removeClass('active');

				$('div#footer_wrapper').text('');
				$('div#footer_wrapper').removeClass('on');

				$('svg#arrow_paths').attr('class','');

			} 
			if(sectionId == 'projects') {

				// Shift map down a bit to make room for sub menu.
				$('div#map_canvas').css('left', '0px').css('top', '100px');

				// Show arrows SVG element.
				$('svg#arrow_paths').attr('class','on');

				// Initiate the first element in the projects list.
				var otherOpen = $('div#header_button_wrapper div#projects div.menuItem').hasClass('active');
				if(!otherOpen){ $( $('div#header_button_wrapper div#projects div.menuItem')[0] ).click(); }

			}

		} else {

			$(self).parent().find('.icon').click();

		}

	},

	headerDropDownMenuClickEvent: function(event) {

		var self = this;

		var isOpen = false;

		if( $(self).parent().hasClass('open') ) isOpen = true;
		
		if(!isOpen) {

			$(self).parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'open', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, function(){
				
				$(self).parent().addClass('open');

				$('#main_wrapper').click(function(){

					$(self).parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, function(){
						
						$(self).parent().removeClass('open');

					});

					$('#main_wrapper').unbind();

				});

			});

		} else {

			$(self).parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, function(){
				$(self).parent().removeClass('open');
			});

		}

	},

	headerMenuItemClickEvent: function(event) {
		
		var self = this;

		var titleElement = $(self).parent().parent().find('span.title');

		var parentId = $(self).parent().parent().attr('id');

		var parentIsActive = $(self).parent().parent().hasClass('active');

		var thisId = $(self).attr('id');
		
		$(self).parent().parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.7s' }, function(){
				
			$(self).parent().parent().removeClass('open');

		});

		window.clearInterval(BP.timers.mapPointOpenDelay);

		if( parentId == 'deployments' ){

			//Find out if it is already open or not.
			var delay = 0; if(!parentIsActive) delay = 2250;
			
			//If not, then delay before firing.
			BP.timers.mapPointOpenDelay = setTimeout(function(){

				$('div.points#deployments div.mapPoint#'+thisId).click();

			},delay);

		} else {

			// console.log('loads projects section: ' + thisId);

			$('div.sub_menu_wrapper div.menu span.btn.active').click();

			$('div#header_button_wrapper div#projects div.menuItem').removeClass('active');
			$('div#header_button_wrapper div#projects div.menuItem#'+thisId).addClass('active');

			$('div.sub_menu_wrapper').removeClass('open');
			$('div.sub_menu_wrapper#' + thisId).addClass('open');

			$('div.sub_details_wrapper').removeClass('active');
			$('div.sub_details_wrapper#' + thisId).addClass('active');

			$('div#footer_wrapper').text( $('div.sub_menu_wrapper#' + thisId).attr('disclaimer') );
			$('div#footer_wrapper').addClass('on');

			BP.views.revealMapPoints('projects', thisId);

		}

		// Click parent if another section hasn't been activated yet.
		if( parentIsActive == false ) titleElement.click();

	},

	mapPointClickEvent: function(event) {

		var self = this;

		var id = $(self).attr("id");

		var disclaimer = $(self).attr("disclaimer") || null;

		var mapLeft = $(self).attr("mapLeft");

		var mapTop = $(self).attr("mapTop");

		var isOpen = $(self).hasClass('open');

		var isLeft = $(self).hasClass('left');

		if( !isOpen ){

			// Closes all other open map points.
			$('div.mapPoint.open').not(self).find('.close').click();

			$(self).css('z-index', '30');

			$(self).addClass('open');
			
			//Stuff for setting active dropDown item.
			$('div.menuItem').not('div.menuItem#'+id).removeClass('active');
			$('div.menuItem#'+id).addClass('active');

			//Shift Map
			$('div#map_canvas').css('left', mapLeft+'px').css('top', mapTop+'px');

			//Show footer disclaimer if a disclaimer exists.
			if(disclaimer != null) {
				$('div#footer_wrapper').text(disclaimer);
				$('div#footer_wrapper').addClass('on');
			} else {
				$('div#footer_wrapper').removeClass('on');	
			}

			// Open technology list animations.
			var lists = [ $(self).find('.list')[0], $(self).find('.list')[1] ];

			if(isLeft) lists.reverse();

			var listGroup = $(self).find('.listGroup');

			var checkLoop;

			async.series([

				function(next){

					setTimeout(next, 400);

				},
				
				function(next){

					$( lists[0] ).cssAnimationReset();
					$( lists[0] ).find('div.techs').cssAnimationReset();

					$( lists[0] ).cssAnimateAuto({ action: 'open', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' });
					
					setTimeout(next, 150);

				},

				function(next){

					checkLoop = setInterval(function(){ BP.views.checklistGroupLengths(listGroup) }, 10);

					$( lists[1] ).cssAnimationReset();
					$( lists[1] ).find('div.techs').cssAnimationReset();

					$( lists[1] ).cssAnimateAuto({ action: 'open', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' });

					setTimeout(next, 500);

				},

				function(next){

					window.clearInterval(checkLoop);
					BP.views.checklistGroupLengths(listGroup);
					
					setTimeout(function(){  
					
						$(self).css('z-index', '');
					
						next();

					}, 250);
					
				}

			]);

		}

	},

	mapPointLabelCloseBtnClickEvent: function(event) {

		var self = this;

		var point = $(self).parent().parent().parent();

		var id = $(point).attr("id");

		var lists = [ $(point).find('div.list')[0], $(point).find('div.list')[1] ];

		var isLeft = $(point).hasClass('left');

		if(isLeft) lists.reverse();

		//Close lists one at a time, then rest.
		async.series([

			function(next){

				next();

				// setTimeout(next, 250);

			},

			function(next){

				$( lists[1] ).cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' });

				setTimeout(next, 150);

			},
			
			function(next){

				$( lists[0] ).cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' });
				
				setTimeout(next, 500);

			},
			
			function(next){
				
				point.removeClass('open');
				
				if(!$('div.mapPoint.open').length) {

					var secStillOpen = true;

					if($('div#header_button_wrapper div.btn#projects').hasClass('active')) secStillOpen = false;

					//Check if any others have opened before shifting back to origin.	
					if(secStillOpen) {

						$('div#map_canvas').css('left', '0px').css('top', '0px');

						//Also for disclaimer
						$('div#footer_wrapper').removeClass('on');

					}

				}

				$('div.menuItem#'+id).removeClass('active');

				$('div.mapPoint div.category').removeClass('open');

				BP.handlers.techCategoryCloseAllEvent();

				next();
			}

		]);

		event.stopPropagation();

	},

	techCategoryToggleClickEvent: function(event) {

		var self = this;
		
		var parent = $(self).parent();

		var listGroup = $(parent).parent().parent();

		var checkLoop = setInterval(function(){ BP.views.checklistGroupLengths(listGroup) }, 10);

		if( parent.hasClass('open') ){

			parent.find('.techs').cssAnimateAuto({ action: 'close' }, function(){
				
				parent.removeClass('open');

				//Check if short.
				window.clearInterval(checkLoop);
				BP.views.checklistGroupLengths(listGroup);

			});

		} else {

			parent.find('.techs').cssAnimateAuto({ action: 'open' }, function(){
				
				parent.addClass('open');

				window.clearInterval(checkLoop);
				BP.views.checklistGroupLengths(listGroup);

			});

		}

	},

	techCategoryCloseAllEvent: function() {

		var elements = $('div.mapPoint .category .toggle');

		var self = elements;
		
		var parent = $(self).parent();

		parent.removeClass('open');

		parent.find('.techs').cssAnimateAuto({
			action: 'close'
		});

	},

	mapClickEvent: function() {

		$('div.mapPoint.open').find('.close').click();
		
	}

}