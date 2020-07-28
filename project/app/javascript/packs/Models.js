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
		user_id: "me",
		name: "undefined",
		nickname: "undefined",
		avatar_url: "#",
	},
	urlRoot: "/api/user_profiles/",
	idAttribute: 'user_id',
	initialize: function() {
		this.fetch();
	},
	// url: function () {
	// 	return this.urlRoot + encodeURIComponent(this.get('user_id'));
	// },
})

Models.FriendProfile = Backbone.Model.extend({
	defaults: {
		user_id: "",
		name: "undefined",
		nickname: "undefined",
		avatar_url: "#",
	},
	urlRoot: "/api/my_friends/",
	idAttribute: 'user_id',
	initialize: function () {
		this.fetch();
	},
}) 

export default Models;