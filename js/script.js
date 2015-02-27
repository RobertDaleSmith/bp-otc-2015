
$("#header_button_wrapper .btn .icon").click(function(event){

	var self = this;

	var isOpen = false;

	if ($(self).parent().attr('class').indexOf("open") >= 0) isOpen = true;
	
	$("#header_button_wrapper .btn").removeClass('open');
	if(!isOpen) $(self).parent().addClass('open');

});


$("#header_button_wrapper .btn .title").click(function(event){

	var self = this;
	
	$("#header_button_wrapper .btn").removeClass('active');
	$(self).parent().addClass('active');

});

$(".menuItem").click(function(event){

	console.log( "isOpen" );
	$("#header_button_wrapper .btn").removeClass('open');

});