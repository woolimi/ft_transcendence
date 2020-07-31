import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Navbar from "./Navbar.js"
import Game from "./Game.js"
import Guild from "./Guild.js"
import Profile from "./Profile.js"
import UserModal from "./UserModal.js"
import Friends from "./Friends.js"

const SPA = {}

SPA.start = function() {
	$(()=> {
		const Router = Backbone.Router.extend({
			routes: {
				"": "game",
				"game": "game",
				"profile": "profile",
				"guild": "guild"
			},
			game: function () {
				Game.content.render();
			},
			profile: function () {
				Profile.content.render();
			},
			guild: function () {
				Guild.content.render();
			}
		});
		const router = new Router();
		Backbone.history.start();

		/* navbar user */
		Navbar.user.render();
		/* navbar items */
		Navbar.items.render();
		router.on("route", function (curRoute) {
			Navbar.currentRoute.set({ route: curRoute });
		});
		/* user info modal */
		UserModal.content.render();
		/* friend list */
		Friends.list.render();
		Friends.searchUserModal.render();
	})
}

export default SPA;