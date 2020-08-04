import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Game from "./Game.js"
import Guild from "./Guild.js"
import Profile from "./Profile.js"
import Chat from "./Chat.js"

const Router = {};
if ($('html').data().isLogin) {
	$(() => {
		const RouterClass = Backbone.Router.extend({
			routes: {
				"": "game",
				"game": "game",
				"profile": "profile",
				"guild": "guild",
				"chat/:user_id": "chat"
			},
			game: function () {
				Game.content.render();
			},
			profile: function () {
				Profile.content.render();
			},
			guild: function () {
				Guild.content.render();
			},
			chat: function (user_id) {
				Chat.content.render(user_id);
			}
		});
		const router = new RouterClass();
		Router.router = router;
	});
}

export default Router;