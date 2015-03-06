BP.views = {

	init: function(){
		// Compile dust templates.
		$('script[type="text/template"]').each(function(){
			dust.loadSource(dust.compile( $(this).html(), $(this).attr('name') ));
		});

		this.loadDeploymentElements();

	},

	render: function(view, data, callback ){
		// Render view and return html.
		dust.render(view, data, function(err, out) {
			callback(out);
		});

	},

	loadDeploymentElements: function(){
		// Renders deployment map points and appends them to mapPoints element.
		var mapPointsElement = $('div#mapPoints');

		var dropDMenuElement = $('div#deployments div.dropDownMenu');

		for(var i=0; i < BP.data.deployments.length; i++){

			var data = BP.data.deployments[i];

			var model = new BP.models.mapPoint(data);

			BP.views.render('mapPoint', model, function(html){

				mapPointsElement.append(html);

			});

			BP.views.render('menuItem', {id: model.id, title: model.title}, function(html){

				dropDMenuElement.append(html);

			});

		}

		BP.views.revealMapPoints();

	},

	revealMapPoints: function(){

		// Shuffle the reveal of the mapPoints.
		var times = [];
		var tDiff = 75;
		var tMin  = 1;
		for(var i=0; i<$('div.mapPoint').length; i++){
			times.push( (i * tDiff) + tMin );
		}
		times.shuffle();


		// Fires when all points have been revealed.
		var finalize = function(){

			setTimeout(function(){
			
				$('div.mapPoint div.label_wrapper').removeClass('hide');
			
			}, 500 );

			// Converts auto width on labels to a set width. This is to enable css transitioning.
			$("div.mapPoint div.label").each(function(){

				var titleWidth = $(this).find('div.title').css("width").replace('px','');

				var leftPadding = $(this).css("padding-left").replace('px','');

				var rightPadding = $(this).css("padding-right").replace('px','');

				var totalWidth = parseInt(titleWidth) + parseInt(leftPadding) + parseInt(rightPadding);

				$(this).css('width',  totalWidth);

			});

		};

		// Reveals all points randomly.
		var remaining = $("div.mapPoint").length;
		$('div.mapPoint').each(function(n){

			var self = this;
			
			setTimeout(function(){

				$(self).removeClass('hide');

				remaining--;

				if(remaining <= 0) finalize();

			}, times[n] );

		});
		
	}

}