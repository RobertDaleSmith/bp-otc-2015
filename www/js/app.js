var jf, util;

try{
	jf 	 = require('jsonfile');
	util = require('util');
}catch(e){
	console.log('default data loaded');
}

$(window).bind("load", function() {

	async.series([

		function(next){
			
			if(jf){

				var filePath = process.execPath.replace("bp-otc-2015.exe","");
				
				if( filePath.contains('bp-otc-2015.app') ) //isMac
					filePath = filePath.split('bp-otc-2015.app')[0]+'bp-otc-2015.app/Contents/';
				
				filePath = filePath + "data.json";

				jf.readFile(filePath, function(err, customData) {

					if(!err){
						BP.data = customData;
						console.log('custom data loaded');
					} else {
						console.log('unable to locate custom data.json');
					}
					
					next();

				});

			} else {

				next();

			}

		},

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