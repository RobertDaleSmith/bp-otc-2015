$(window).bind("load", function() {

	async.series([

		function(next){

			BP.views.init();
			next();

		},

		function(next){

			BP.handlers.init();
			next();

		}

	], function(err){

		setTimeout(BP.views.endSplashScreen, 1000);

	});	

});