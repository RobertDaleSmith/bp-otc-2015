BP.handlers = {

	init: function() {

		$('div#header_button_wrapper .btn .title').click(this.headerMainMenuClickEvent);

		$('div#header_button_wrapper .btn .icon').click(this.headerDropDownMenuClickEvent);

		$('div.menuItem').click(this.headerMenuItemClickEvent);

		$('.sub_menu_wrapper .menu .btn').click(this.subMenuClickEvent);

		$('div#deployments div.mapPoint').click(this.mapPointClickEvent);

		$('div#deployments div.mapPoint .close').click(this.mapPointLabelCloseBtnClickEvent);

		$('div.listGroup div.title, div.listGroup div.toggle').click(this.techCategoryToggleClickEvent);

		$('div#mapImage').click(this.mapClickEvent);

		this.keyboardKeyEventsInit();


		var mapPointLabels = $('div#projects div.mapPoint div.label');
		// draggable(mapPointLabels[0]);

		mapPointLabels.each(function(){

			this.addEventListener("mousedown", function(e){ BP.handlers.tools.labels.mouseDown(e, this) }, false);
			this.addEventListener("mouseup"  , function(e){ BP.handlers.tools.labels.mouseUp(  e, this) }, false);
			this.addEventListener("mousemove", function(e){ BP.handlers.tools.labels.mouseMove(e, this) }, false);

		});

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
					
					$('#mapImage')[0].addEventListener("mousemove", function(e){ BP.handlers.tools.labels.mouseMove(e, this) }, false);
					$('#mapImage')[0].addEventListener("mouseUp",   function(e){ BP.handlers.tools.labels.mouseMove(e, this) }, false);

					$(this.elDragging).addClass('dragging');

				}
				
			},

			mouseMove: function(e, element){
				if(this.isDown) {
					
					var diff = {x: e.clientX-this.start.x, y: e.clientY-this.start.y};
					// console.log( diff.x + " x " + diff.y );

					var newPos = { x: (this.elPos.x + diff.x), y: (this.elPos.y + diff.y) };
					// console.log( newPos.x + " x " + newPos.y );

					$(this.elDragging).css('left', newPos.x).css('top', newPos.y);

				}
			},

			mouseUp: function(e, element){

				$(this.elDragging).removeClass('dragging');

				this.isDown = false;
				this.elDragging = false;
				this.start = {x:0, y:0};
				this.elPos = {x:0, y:0};

				$('#mapImage').unbind();

			}		

		}

	},

	subMenuClickEvent: function() {

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
			var sequences = arrows[project][color];

			// Extends section post.
			if( !sequences.start || sequences.start == "")
				 sequences.start = "none";
			else hasStartPt = true;
			
			$('div.mapPoint#'+sequences.start).addClass('start');

			var time = 750;
			if(!hasStartPt) time = 100;

			window.clearInterval(BP.intervals.sequences);
			// Delays start of sequence until post is extended.
			BP.intervals.sequences = setTimeout(function(){
				
				var sequencesLoop = function(count){
					if(count >= sequences.length) return;
					
					//Open corresponding footer description.
					// console.log(sequences[count].name);
					$('.sub_details .item#'+sequences[count].name).addClass('active')

					BP.handlers.playSequence(sequences[count].arrows, function(){ sequencesLoop(count+1) });

				}
				sequencesLoop(0);

			},time);
				

		} else {

			window.clearInterval(BP.intervals.sequences);

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
						next();
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

	resetProjectsStateEvent: function() {
		
		// Fires without a color, hence resets points.
		// BP.handlers.subMenuClickEvent();

	},

	resetAllArrows: function() {

		for (var key in arrows) {
			var project = arrows[key];
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

	headerMainMenuClickEvent: function(event) {

		var self = this;

		var sectionId = $(self).parent().attr('id'); 

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
				$( $('div#header_button_wrapper div#projects div.menuItem')[0] ).click();

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

		if( $(self).parent().parent().hasClass('active') == false ) {

			titleElement.click();

		}

		var thisId = $(self).attr('id');
		
		$(self).parent().parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.7s' }, function(){
				
			$(self).parent().parent().removeClass('open');

		});


		if( parentId == 'deployments' ){

			$('div.points#deployments div.mapPoint#'+thisId).click();

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
					
					//Check if any others have opened before shifting back to origin.	
					$('div#map_canvas').css('left', '0px').css('top', '0px');

					//Also for disclaimer
					$('div#footer_wrapper').removeClass('on');

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