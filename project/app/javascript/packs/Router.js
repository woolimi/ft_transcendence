import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Game from "./Game.js"
import Guild from "./Guild.js"
import Profile from "./Profile.js"
import Chat from "./Chat.js"
import Navbar from "./Navbar.js"
import ChatChannel from "../channels/chat_channel.js"

const Router = {};
if ($('html').data().isLogin) {
	$(() => {
		const RouterClass = Backbone.Router.extend({
			routes: {
				"": "game",
				"game": "game",
				"profile": "profile",
				"guild": "guild",
				"chats/:room": "chat"
			},
			game: function () {
				if (ChatChannel.channel)
					ChatChannel.unsubscribe();
				Game.content.render();
			},
			profile: function () {
				if (ChatChannel.channel)
					ChatChannel.unsubscribe();
				Profile.content.render();
				Profile.searchBlockUserModal.render();
			},
			guild: function () {
				if (ChatChannel.channel)
					ChatChannel.unsubscribe();
				Guild.content.render();
			},
			chat: function (room) {
				if (Chat.content)
					Chat.content.undelegateEvents();
				if (ChatChannel.channel)
					ChatChannel.unsubscribe();
				Chat.content = new Chat.Content({room: room});
			}
		});
		const router = new RouterClass();
		Router.router = router;

		Router.router.on("route", function (curRoute, params) {
			Navbar.currentRoute.set({ route: curRoute });
		});

	});
}

export default Router;