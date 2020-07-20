import _ from "underscore"
import Backbone from "backbone"

const Route = Backbone.Model.extend({
	defaults: {
		route: "game"
	}
});

export {
	Route,
};