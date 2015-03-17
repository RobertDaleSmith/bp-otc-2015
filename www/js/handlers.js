BP.handlers = {

	init: function() {

		$('div#header_button_wrapper .btn .title').click(BP.handlers.headerMainMenuClickEvent);

		$('div#header_button_wrapper .btn .icon').click(BP.handlers.headerDropDownMenuClickEvent);

		$('div.menuItem').click(BP.handlers.headerMenuItemClickEvent);

		$('div#deployments div.mapPoint').click(BP.handlers.mapPointClickEvent);

		$('div#deployments div.mapPoint .close').click(BP.handlers.mapPointLabelCloseBtnClickEvent);

		$('div.listGroup div.title, div.listGroup div.toggle').click(BP.handlers.techCategoryToggleClickEvent);

		$('div#mapImage').click(BP.handlers.mapClickEvent);

		this.keyboardKeyEventsInit();

		$('#sub_menu_wrapper .menu .btn').click(BP.handlers.subMenuClickEvent);






		


		

		var bMouseDragging = false;
		var nMouseOffsetX = 0;
		var nMouseOffsetY = 0;
		var draggingEl = null;

		function mouseDown(e){
			
			var self = this;

			bMouseDragging = true;

			var p = $('svg#arrow_paths_wrapper')[0].createSVGPoint();
            p.x = e.clientX;
            p.y = e.clientY;
            
            var m = self.getScreenCTM();
            p = p.matrixTransform(m.inverse());
            nMouseOffsetX = p.x - parseInt( self.getAttribute("cx") );
            nMouseOffsetY = p.y - parseInt( self.getAttribute("cy") );

            draggingEl = this;

            if( $(this).attr('class') =='start' || $(this).attr('class') =='end' ) $(this).attr('stroke-width','1');

		};
		function mouseMove(e){

			var self = draggingEl || this;

			var p = $('svg#arrow_paths_wrapper')[0].createSVGPoint();
            p.x = e.clientX;
            p.y = e.clientY;

            var m = self.getScreenCTM();
			p = p.matrixTransform(m.inverse());
			// console.log('('+p.x+', '+p.y+')');
			// console.log(p);

			if(bMouseDragging) {

				$('#test_path').attr('stroke','LIGHTGREY');
				
				var pos = {x: p.x - nMouseOffsetX, y: p.y - nMouseOffsetY};
				self.setAttribute("cx", pos.x);
                self.setAttribute("cy", pos.y);

                //do something
                var whichPoint = $(draggingEl).attr('class');
                // console.log( whichPoint );
                if(whichPoint == 'start'){

                	path.X1 = pos.x;
                	path.Y1 = pos.y;

                }

                if(whichPoint == 'end'){

                	path.X2 = pos.x;
                	path.Y2 = pos.y;

                }

                if(whichPoint == 'ctr1'){

                	path.Xc1 = pos.x;
                	path.Yc1 = pos.y;

                }

                if(whichPoint == 'ctr2'){

                	path.Xc2 = pos.x;
                	path.Yc2 = pos.y;

                }

                $('#test_path').attr('d', pathToStr(path));

                $('#test_guide1').attr('d', 'M'+path.Xc1+' '+path.Yc1+' '+path.X1+' '+path.Y1);
                $('#test_guide2').attr('d', 'M'+path.Xc2+' '+path.Yc2+' '+path.X2+' '+path.Y2);


			}

		};
		function mouseUp(e){
			
			bMouseDragging = false;

			draggingEl = null;

			$('#test_path').attr('stroke','transparent');
			if( $(this).attr('class') =='start' || $(this).attr('class') =='end' ) $(this).attr('stroke-width','0');

			play();

		};

		$('#arrow_paths_wrapper circle').each(function(){
			this.addEventListener("mousedown", mouseDown, false);
			this.addEventListener("mouseup", mouseUp, false);
			this.addEventListener("mousemove", mouseMove, false);
		});
		$('svg#arrow_paths_wrapper')[0].addEventListener("mousemove", mouseMove, false);

	},

	subMenuClickEvent: function() {

		var self = this;

		var id = $(self).attr('id');

		var active = $(self).hasClass('active');

		var color = $(self).attr('class') || "";
			color = color.replace('btn ','').replace(' active','') || 'none';

		var activePoints = [];

		var inactivePoints = [];

		if(!active){

			// Not active, so activate it.

			$('div#projects div.mapPoint').each(function(){

				if( $(this).attr('color').contains(color) ){

					activePoints.push( this );

				} else {
					
					inactivePoints.push( this );

				}

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
			$('div.sub_details_wrapper#asi div.sub_details').removeClass('active');
			$('div.sub_details_wrapper#asi div.sub_details.'+color).addClass('active');

			// Submenu btn active state toggle.
			$('div#sub_menu_wrapper .menu .btn').removeClass('active');
			$('div#sub_menu_wrapper .menu .btn.'+color).addClass('active');

			// Manual Sequences
			$('div.mapPoint').removeClass('start');
			if(color == 'green'){

				// Hard code green ASI sequence here.

				$('div.mapPoint#algeria').addClass('start');

				setTimeout(function(){

					console.log('GO TEAM GREEN SAUCE!!');

				},1000);



			} else if(color == 'orange'){

				$('div.mapPoint#northSea').addClass('start');

			} else if(color == 'blue'){

				$('div.mapPoint#brazil').addClass('start');

			}

		} else {

			// Active, so reset section state.
			BP.handlers.resetProjectsStateEvent();

		}

			

	},

	resetProjectsStateEvent: function() {
		
		// Fires without a color, hence resets points.
		BP.handlers.subMenuClickEvent();

	},

	keyboardKeyEventsInit: function() {

		$(window).on('keyup',function(e){
		
			// console.log(e.keyCode);

			if(e.keyCode == 27){ //esc
				
				if( $('div#header_wrapper .btn.open').length > 0 ){

					// Close any open header menu buttons.
					$('div#header_button_wrapper .btn.open .icon').click();

				} else if ( $('div.mapPoint.open').length > 0 ) {

					// Close any open mapPoints.
					$('div.mapPoint.open').find('.close').click();

				} else {

					// 
					BP.handlers.resetProjectsStateEvent();

				}

			}


		});
	},

	headerMainMenuClickEvent: function(event) {

		var self = this;

		var sectionId = $(self).parent().attr('id'); 

		// console.log(sectionId);

		$('div.mapPoint.open').find('.close').click();
		
		$("#header_button_wrapper .btn").removeClass('active');

		$(self).parent().addClass('active');
		
		$("#intro_wrapper").css('display','none');
		
		$("div.mapPoint").addClass('hide');

		$("div.mapPoint div.label_wrapper").addClass('hide');

		if(sectionId == 'deployments') {
			
			$('div#sub_menu_wrapper').removeClass('open');

			$('div#map_canvas').css('left', '0px').css('top', '0px');
			BP.views.revealMapPoints('deployments');

			$('div.sub_details_wrapper').removeClass('active');
			$('div.sub_details_wrapper div.sub_details').removeClass('active');

			$('div#footer_wrapper').text('');
			$('div#footer_wrapper').removeClass('on');

			$('svg#arrow_paths_wrapper').attr('class','');

		} 
		if(sectionId == 'projects') {

			$('div#sub_menu_wrapper').addClass('open');

			$('div#map_canvas').css('left', '0px').css('top', '100px');
			BP.views.revealMapPoints('projects');

			$('div.sub_details_wrapper#asi').addClass('active');

			$('div#footer_wrapper').text( $('div.sub_details_wrapper#asi').attr('disclaimer') );
			$('div#footer_wrapper').addClass('on');

			$('svg#arrow_paths_wrapper').attr('class','on');


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
		console.log('1');
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

			// TODO: DUDE! Finish this...
			console.log('load projects section: ' + thisId);


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

					clearInterval(checkLoop);
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
				clearInterval(checkLoop);
				BP.views.checklistGroupLengths(listGroup);

			});

		} else {

			parent.find('.techs').cssAnimateAuto({ action: 'open' }, function(){
				
				parent.addClass('open');

				clearInterval(checkLoop);
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