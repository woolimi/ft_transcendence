import _ from "underscore"
import Backbone from "backbone"

const Models = {};

Models.Route = Backbone.Model.extend({
	defaults: {
		route: "game"
	}
});

Models.UserProfile = Backbone.Model.extend({
	defaults: {
		name: "undefined",
		nickname: "undefined",
		avatar_url: "#",
	},
	urlRoot: "/api/user_profiles/",
	url: function () {
		const base = this.urlRoot || (this.collection && this.collection.url) || "/";
		if (this.isNew()) return base;
		return base + encodeURIComponent(this.id);
	},
	initialize: function() {
		this.fetch();
	},
}) 

export default Models;