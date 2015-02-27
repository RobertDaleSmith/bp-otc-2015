
$("#header_button_wrapper .btn .icon").click(function(event){

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

});


$("#header_button_wrapper .btn .title").click(function(event){

	var self = this;
	
	$("#header_button_wrapper .btn").removeClass('active');
	$(self).parent().addClass('active');

});

$(".menuItem").click(function(event){

	var self = this;

	var pointId = $(self).attr('id');
	
	$("#header_button_wrapper .btn").removeClass('open');

	$(self).parent().parent().find('.icon i').attr("class","fa fa-chevron-down");

	$('.mapPoint#'+pointId).click();

});


$(".mapPoint").click(function(event){

	var self = this;

	var id = $(this).attr("id");

	console.log($(this).hasClass('open'));

	if( !$(this).hasClass('open') ){
		var labelWidth = $(this).find('.label').css("width");
		$(this).find('.label').css('width', labelWidth);
	}


	showFloater( id );

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

});

function showFloater(name){

	console.log( name );

}