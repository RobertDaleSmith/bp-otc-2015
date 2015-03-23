BP.views.init();

BP.handlers.init();


var arrows1 = [], arrows2 = [];

BP.views.render('svg', {projects: BP.data.projects}, function(html){
	
	// Insert rendered SVG markup
	$('#map_content_wrapper').append(html);

	// Init SVG paths and handlers.
	BP.data.projects[0].sections[0].sequences[0].arrows.forEach(function(curve, idx){
		
		var seqId = BP.data.projects[0].sections[0].sequences[0].id,
				color = BP.data.projects[0].sections[0].color,
				id 		= BP.data.projects[0].id;
		
		arrows1.push( new Arrow(id, color, seqId, idx, curve.path) );

	});

	BP.data.projects[0].sections[0].sequences[1].arrows.forEach(function(curve, idx){
		
		var seqId = BP.data.projects[0].sections[0].sequences[1].id,
				color = BP.data.projects[0].sections[0].color,
				id 		= BP.data.projects[0].id;
		 
		arrows2.push( new Arrow(id, color, seqId, idx, curve.path) );

	});

});

