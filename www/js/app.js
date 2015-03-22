BP.views.init();

BP.handlers.init();


var arrows = [];

BP.views.render('svg', {projects: BP.data.projects}, function(html){
	
	// Insert rendered SVG markup.	
	$('#map_content_wrapper').append(html);

	// Init SVG paths and handlers.
	BP.data.projects[0].sections[0].arrows.forEach(function(curve, idx){
		
		var color = BP.data.projects[0].sections[0].color,
				id 		= BP.data.projects[0].id;
		 
		arrows.push( new Arrow(id, color, idx, curve.path) );

	});

});

