BP.models = {

	mapPoint: function( point ) {

		// Define default values and or set passed values.

		this.id = point.id || "",

		this.title = point.title || "";
		
		this.left = point.left || false;

		this.half = point.half || false;

		this.under = point.under || false;

		this.color = point.color || ["green"];

		this.description = point.description || "";

		this.disclaimer = point.disclaimer || "";

		this.location = point.location || { x: 0, y: 0 };

		this.map = point.map || { x: 0, y: 0 };

		this.technology = point.technology || [ [], [] ];

		this.statuses = point.statuses || null;

		this.position = point.position || null;

	}

}