BP.handlers = {

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

		var pointId = $(self).attr('id');
		
		$("#header_button_wrapper .btn").removeClass('open');

		$('.mapPoint#'+pointId).click();

		// Triggers section.
		
		$(self).parent().parent().find('.title').click();

	},

	mapPointClickEvent: function(event) {

		var self = this;

		var id = $(self).attr("id");

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
			$('.menuItem').removeClass('active');
			$('.menuItem#'+id).addClass('active');

			//Shift Map
			$('#map_wrapper').css('left', mapLeft+'px').css('top', mapTop+'px');

			//Show footer disclaimer.
			$('#footer_wrapper').addClass('on');

		}

	},

	mapPointLabelCloseBtnClickEvent: function(event) {

		var self = this;

		var point = $(self).parent().parent();

		point.removeClass('open');

		var id = $(point).attr("id");

		$('#map_wrapper').css('left', '0px').css('top', '0px');

		$('.menuItem').removeClass('active');

		$('#footer_wrapper').removeClass('on');

		event.stopPropagation();

	},

	techCategoryToggleClickEvent: function(event) {

		var self = this;
		
		var parent = $(self).parent();

		parent.toggleClass('open');

	}

}