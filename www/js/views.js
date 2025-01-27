BP.views = {

	init: function(){
		// Compiles dust templates.
		$('script[type="text/template"]').each(function(){
			dust.loadSource(dust.compile( $(this).html(), $(this).attr('name') ));
		});

		this.loadDeploymentMapElements();

		this.loadProjectsMapElements();

		this.loadProjectsSubElements();

		this.loadProjectsArrowsSVG();

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

			var wrapperEl = document.createElement('div');
				wrapperEl.setAttribute('class', 'project');
				wrapperEl.setAttribute('id', section.id);

			mapPointsElement.append(wrapperEl)

			for(var n=0; n < BP.data.projects[i].locations.length; n++){

				var data = BP.data.projects[i].locations[n];

				var model = new BP.models.mapPoint(data);

				model.project = true;

				BP.views.render('mapPoint', model, function(html){

					$(wrapperEl).append(html);

				});

			}

		}

		BP.handlers.tools.labels.updatePositions();

	},

	revealMapPoints: function(map, sub){

		var parentMap = '';

		if( map ) parentMap = 'div#mapPoints div#' + map + ' ';
		if( sub ) parentMap = parentMap + 'div.project#' + sub + ' ';

		$("div.mapPoint").addClass('hide');
		$("div.mapPoint div.label_wrapper").addClass('hide');
		
		// Shuffle the reveal of the mapPoints.
		var times = [];
		var tDiff = 75;
		var tMin  = 100;
		for(var i=0; i<$(parentMap+'div.mapPoint').length; i++){
			times.push( (i * tDiff) + tMin );
		}
		times = shuffle(times);

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

		// Clear any other pending reveals..
		BP.timers.mapPointReveals.forEach(function(t){ window.clearTimeout(t) });
		BP.timers.mapPointReveals = [];

		// Reveals all points randomly.
		var remaining = $(parentMap+'div.mapPoint').length;
		$(parentMap+'div.mapPoint').each(function(n){

			var self = this;

			var timer = setTimeout(function(){

				$(self).removeClass('hide');

				// console.log( $(self).attr('id') );

				remaining--;

				if(remaining <= 0) finalize();

				// Reveals labels in sequence.
				if(!BP.settings.revealLabelsTogether) setTimeout(function(){ $(self).find('.label_wrapper').removeClass('hide'); }, 500 );

			}, times[n] );

			BP.timers.mapPointReveals.push(timer);

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

	},

	loadProjectsSubElements: function(){
		// Renders projects sub menu and sub details elements.
		var subMenusContainerElement = $('div#sub_menu_container');
		var subDetailsContainerElement = $('div#sub_details_container');

		for(var i=0; i < BP.data.projects.length; i++){

			var data = BP.data.projects[i];
			
			var model = {	id: data.id, 
						 	title: data.title, 
						 	color: data.color, 
						 	sections: data.sections, 
						 	disclaimer: data.disclaimer
						};

			BP.views.render('projectSubMenu', model, function(html){

				subMenusContainerElement.append(html);

			});

			BP.views.render('projectSubDetail', model, function(html){

				subDetailsContainerElement.append(html);

			});

		}

	},

	loadProjectsArrowsSVG: function(){

		BP.arrows = {};

		BP.views.render('svg', {projects: BP.data.projects}, function(html){
			
			// Insert rendered SVG markup
			$('#map_content_wrapper').append(html);
			
			// Loops through all projects.
			BP.data.projects.forEach(function(project, proIndex){
				
				BP.arrows[project.id] = {};

				// Loops through all sections within a project.
				project.sections.forEach(function(section, secIndex){

					BP.arrows[project.id][section.color] = [];

					var colorIndex = -1;
					
					// Loops through all sequences within a section.
					section.sequences.forEach(function(sequence, seqIndex){

						BP.arrows[project.id][section.color].push( { name: sequence.id, arrows: [] } );
						BP.arrows[project.id][section.color].start = section.start;
						
						// Loops through all arrows within a sequence.
						sequence.arrows.forEach(function(arrow, arrIndex){

							colorIndex++;

							BP.arrows[project.id][section.color][seqIndex].arrows.push( new Arrow(project.id, section.color, sequence.id, arrIndex, colorIndex, arrow.path) );
							
						});

					});

				});

			});

		});

	},

	endSplashScreen: function(){

		$('#splash_wrapper').addClass('hide');

		setTimeout(function(){

			$('#splash_wrapper').css('display','none');

			BP.player.play();

		}, 500);
		

	},

	loading: function(percent){

		$('div#splash_wrapper div.preloader div.progress').css('width', percent+"%");

	}

}