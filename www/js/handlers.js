BP.handlers = {

	init: function() {

		$("div#header_button_wrapper .btn .title").click(BP.handlers.headerMainMenuClickEvent);

		$("div#header_button_wrapper .btn .icon").click(BP.handlers.headerDropDownMenuClickEvent);

		$("div.menuItem").click(BP.handlers.headerMenuItemClickEvent);

		$("div.mapPoint").click(BP.handlers.mapPointClickEvent);

		$("div.mapPoint .close").click(BP.handlers.mapPointLabelCloseBtnClickEvent);

		$("div.listGroup div.title, div.listGroup div.toggle").click(BP.handlers.techCategoryToggleClickEvent);

	},

	headerMainMenuClickEvent: function(event) {

		var self = this;

		var sectionId = $(self).parent().attr('id'); 

		console.log(sectionId);
		
		$("#header_button_wrapper .btn").removeClass('active');

		$(self).parent().addClass('active');
		
		$("#intro_wrapper").css('display','none');
		
		$("div.mapPoint").addClass('hide');

		$("div.mapPoint div.label_wrapper").addClass('hide');

		if(sectionId == 'deployments') {
			BP.views.revealMapPoints();
		} 
		if(sectionId == 'projects') {
			//TODO: Build out this section dude!
		}

	},

	headerDropDownMenuClickEvent: function(event) {

		var self = this;

		var isOpen = false;

		if ($(self).parent().attr('class').indexOf("open") >= 0) isOpen = true;
		
		//TODO: $("#header_button_wrapper .btn").removeClass('open');
		if(!isOpen) {

			$(self).parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'open', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, function(){
				
				$(self).parent().addClass('open');
				$(self).find('i').attr("class","fa fa-chevron-up");

			});

		} else {

			$(self).parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, function(){
				
				$(self).parent().removeClass('open');
				$(self).find('i').attr("class","fa fa-chevron-down");

			});
			
		}

	},

	headerMenuItemClickEvent: function(event) {

		var self = this;

		if( !$(self).parent().parent().hasClass('active') ) {
			$(self).parent().parent().find('.title').click();
		}

		var pointId = $(self).attr('id');
		
		// $("#header_button_wrapper .btn").removeClass('open');

		$(self).parent().parent().find('div.dropDownMenu').cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.7s' }, function(){
				
			$(self).parent().parent().removeClass('open');
			$(self).parent().find('i').attr("class","fa fa-chevron-down");

		});

		$('.mapPoint#'+pointId).click();

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

			// $('div.mapPoint').removeClass('open');
			$('div.mapPoint').each(function(){

				if( $(this).hasClass('open') ){

					$(this).find('.label .close').click();

				}

			});

			$(self).css('z-index', '30');

			$(self).addClass('open');
			
			//Stuff for setting active dropDown item.
			$('div.menuItem').not('div.menuItem#'+id).removeClass('active');
			$('div.menuItem#'+id).addClass('active');

			//Shift Map
			$('div#map_wrapper').css('left', mapLeft+'px').css('top', mapTop+'px');

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

					$( lists[0] ).cssAnimateAuto({ action: 'open', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' });
					//here
					
					setTimeout(next, 150);

				},

				function(next){

					checkLoop = setInterval(function(){ BP.views.checklistGroupLengths(listGroup) }, 10);

					$( lists[1] ).cssAnimateAuto({ action: 'open', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, next);

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

		var lists = [ $(point).find('.list')[0], $(point).find('.list')[1] ];

		var isLeft = $(point).hasClass('left');

		if(isLeft) lists.reverse();

		//Close lists one at a time, then rest.
		async.series([

			function(next){

				// setTimeout(next, 250);
				next();

			},

			function(next){

				$( lists[1] ).cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' });

				setTimeout(next, 150);

			},
			
			function(next){

				$( lists[0] ).cssAnimateAuto({ action: 'close', transition: 'height cubic-bezier(.62,.28,.23,.99) 0.5s' }, next);
				
			},
			
			function(next){
				
				point.removeClass('open');

				//Check if any others have opened before shifting back to origin.
				var cnt = 0;
				$('div.mapPoint').each(function(){ if( $(this).hasClass('open') ) cnt++; });

				if(cnt == 0) $('div#map_wrapper').css('left', '0px').css('top', '0px');

				$('div.menuItem#'+id).removeClass('active');

				$('div#footer_wrapper').removeClass('on');

				$('div.mapPoint .category').removeClass('open');

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

	}

}