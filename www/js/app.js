BP.views.init();

BP.handlers.init();


var projectArrows = [];
var arrows = {};

BP.views.render('svg', {projects: BP.data.projects}, function(html){
	
	// Insert rendered SVG markup
	$('#map_content_wrapper').append(html);
	
	// Loops through all projects.
	BP.data.projects.forEach(function(project, proIndex){
		
		// projectArrows.push( {project: project.id, sections: [] } );
		arrows[project.id] = {};


		// Loops through all sections within a project.
		project.sections.forEach(function(section, secIndex){

			// projectArrows[proIndex].sections.push( {section: section.color, sequences: [] } );
			arrows[project.id][section.color] = [];

			
			// Loops through all sequences within a section.
			section.sequences.forEach(function(sequence, seqIndex){

				// projectArrows[proIndex].sections[secIndex].sequences.push( {sequence: sequence.id, arrows: [] } );
				arrows[project.id][section.color].push( { name: sequence.id, arrows: [] } );
				arrows[project.id][section.color].start = section.start;

				
				// Loops through all arrows within a sequence.
				sequence.arrows.forEach(function(arrow, idx){

					// projectArrows[proIndex].sections[secIndex].sequences[seqIndex].arrows.push( new Arrow(project.id, section.color, sequence.id, idx, arrow.path) );
					arrows[project.id][section.color][seqIndex].arrows.push( new Arrow(project.id, section.color, sequence.id, idx, arrow.path) );
					

				});

			});

		});

	});


});

