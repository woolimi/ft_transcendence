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
		user_name: "null",
		display_name: "null",
		display_name: "null",
		guild_id: "null",
		two_factor: false,
		avatar_url: "#",
		friend_list: {},
		block_list: {},
		is_owner: false,
		is_officer: false,
		is_admin: false,	
	}
}) 

export default Models;