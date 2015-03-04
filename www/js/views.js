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

	}

}