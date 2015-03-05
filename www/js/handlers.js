BP.handlers = {

	init: function() {

		$("div#header_button_wrapper .btn .title").click(BP.handlers.headerMainMenuClickEvent);

		$("div#header_button_wrapper .btn .icon").click(BP.handlers.headerDropDownMenuClickEvent);

		$("div.menuItem").click(BP.handlers.headerMenuItemClickEvent);

		$("div.mapPoint").click(BP.handlers.mapPointClickEvent);

		$("div.mapPoint .close").click(BP.handlers.mapPointLabelCloseBtnClickEvent);

		$("div.techDeployments .title").click(BP.handlers.techCategoryToggleClickEvent);

		$("div.techDeployments .toggle").click(BP.handlers.techCategoryToggleClickEvent);

	},

	headerMainMenuClickEvent: function(event) {

		var self = this;

		var sectionId = $(self).parent().attr('id'); 

		console.log(sectionId);
		
		$("#header_button_wrapper .btn").removeClass('active');

		$(self).parent().addClass('active');

		
		$("#intro_wrapper").css('display','none');
		if(sectionId == 'deployments') {
			$("#mapPoints").css('display','');
		} 
		if(sectionId == 'projects') {
			$("#mapPoints").css('display','none');
		}

	},

	headerDropDownMenuClickEvent: function(event) {

		var self = this;

		var isOpen = false;

		if ($(self).parent().attr('class').indexOf("open") >= 0) isOpen = true;
		
		$("#header_button_wrapper .btn").removeClass('open');
		if(!isOpen) {
			$(self).parent().addClass('open');

			$(self).find('i').attr("class","fa fa-chevron-up");
		} else {
			$(self).find('i').attr("class","fa fa-chevron-down");
		}

	},

	headerMenuItemClickEvent: function(event) {

		var self = this;

		if( !$(self).parent().parent().hasClass('active') ) {
			$(self).parent().parent().find('.title').click();
		}

		var pointId = $(self).attr('id');
		
		$("#header_button_wrapper .btn").removeClass('open');

		$('.mapPoint#'+pointId).click();

	},

	mapPointClickEvent: function(event) {

		var self = this;

		var id = $(self).attr("id");

		var disclaimer = $(self).attr("disclaimer") || null;

		var mapLeft = $(self).attr("mapLeft");

		var mapTop = $(self).attr("mapTop");

		var isOpen = $(self).hasClass('open');

		if( !isOpen ){

			var labelWidth = $(self).find('.label').css("width");

			$(self).find('.label').css('width', labelWidth);

			$('div.mapPoint').removeClass('open');

			setTimeout(function(){

				$(self).addClass('open');

				setTimeout(function(){

					$(self).css('width', '');

				}, 1);

			}, 1);

			//Stuff for setting active dropDown item.
			$('div.menuItem').removeClass('active');
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
			var lists = $(self).find('.list');

			setTimeout(function(){

				$( lists[0] ).cssAnimateAuto({action: 'open'});

			}, 250);
			setTimeout(function(){

				$( lists[1] ).cssAnimateAuto({action: 'open'});

			}, 500);

		}

	},

	mapPointLabelCloseBtnClickEvent: function(event) {

		var self = this;

		var point = $(self).parent().parent().parent();


		var id = $(point).attr("id");

		var lists = $(point).find('.list');

		//Close lists.
		$( lists[1] ).cssAnimateAuto({action: 'close'});
		setTimeout(function(){

			$( lists[0] ).cssAnimateAuto({action: 'close'});

		}, 250);

		setTimeout(function(){

			point.removeClass('open');

			$('div#map_wrapper').css('left', '0px').css('top', '0px');

			$('div.menuItem').removeClass('active');

			$('div#footer_wrapper').removeClass('on');

			$('div.mapPoint .category').removeClass('open');

			BP.handlers.techCategoryCloseAllEvent();

		}, 500);

		

		event.stopPropagation();

	},

	techCategoryToggleClickEvent: function(event) {

		var self = this;
		
		var parent = $(self).parent();

		parent.toggleClass('open');

		parent.find('.techs').cssAnimateAuto();

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