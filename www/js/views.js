BP.views = {

	init: function(){
		// Compiles dust templates.
		$('script[type="text/template"]').each(function(){
			dust.loadSource(dust.compile( $(this).html(), $(this).attr('name') ));
		});

		this.loadDeploymentMapElements();

		this.loadProjectsMapElements();

	},

	render: function(view, data, callback ){
		// Render view and return html.
		dust.render(view, data, function(err, out) {
			callback(out);
		});

	},

	loadDeploymentMapElements: function(){
		// Renders deployment map points and appends them to mapPoints element.
		var mapPointsElement = $('div#mapPoints div.points#deployments');

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

	},

	loadProjectsMapElements: function(){
		// Renders deployment map points and appends them to mapPoints element.
		var mapPointsElement = $('div#mapPoints div.points#projects');

		var dropDMenuElement = $('div#projects div.dropDownMenu');

		for(var i=0; i < BP.data.projects.length; i++){

			var section = {id: BP.data.projects[i].id, title: BP.data.projects[i].title};

			BP.views.render('menuItem', section, function(html){

				dropDMenuElement.append(html);

			});

			for(var n=0; n < BP.data.projects[i].locations.length; n++){

				var data = BP.data.projects[i].locations[n];

				var model = new BP.models.mapPoint(data);

				BP.views.render('mapPoint', model, function(html){

					mapPointsElement.append(html);

				});

			}

		}

	},

	revealMapPoints: function(map){

		var parentMap = '';
		if( map ) parentMap = 'div#' + map + ' ';

		// Shuffle the reveal of the mapPoints.
		var times = [];
		var tDiff = 75;
		var tMin  = 1;
		for(var i=0; i<$(parentMap+'div.mapPoint').length; i++){
			times.push( (i * tDiff) + tMin );
		}
		times.shuffle();

		// Fires when all points have been revealed.
		var finalize = function(){

			// Reveals all labels at once.
			if(BP.settings.revealLabelsTogether) setTimeout(function(){ $(parentMap+'div.label_wrapper').removeClass('hide'); }, 500 );

			// Converts auto width on labels to a set width. This is to enable css transitioning.
			$(parentMap+'div.mapPoint div.label').each(function(){

				var titleWidth = $(this).find('div.title').css("width").replace('px','');

				var leftPadding = $(this).css("padding-left").replace('px','');

				var rightPadding = $(this).css("padding-right").replace('px','');

				var totalWidth = parseInt(titleWidth) + parseInt(leftPadding) + parseInt(rightPadding);

				$(this).css('width',  totalWidth);

			});

		};

		// Reveals all points randomly.
		var remaining = $(parentMap+'div.mapPoint').length;
		$(parentMap+'div.mapPoint').each(function(n){

			var self = this;


			setTimeout(function(){

				$(self).removeClass('hide');

				// console.log( $(self).attr('id') );

				remaining--;

				if(remaining <= 0) finalize();

				// Reveals labels in sequence.
				if(!BP.settings.revealLabelsTogether) setTimeout(function(){ $(self).find('.label_wrapper').removeClass('hide'); }, 500 );

			}, times[n] );

		});
		
	},

	checklistGroupLengths: function(listGroup){

		var lists = listGroup.find('.list');

		var heights = [];
		
		lists.each(function(i){ heights[i] = $(this).height(); });

		if( heights[0] < heights[1] ) {

			$(lists[0]).addClass('short'); $(lists[1]).removeClass('short');

		} else if( heights[0] > heights[1] ) {

			$(lists[1]).addClass('short'); $(lists[0]).removeClass('short');

		} else {//( heights[0] == heights[1] )

			$(lists[0]).addClass('short'); $(lists[1]).addClass('short');

		}

	}

}