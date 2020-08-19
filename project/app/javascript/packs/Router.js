import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Game from "./Game.js"
import Guild from "./Guild.js"
import Profile from "./Profile.js"
import Chat from "./Chat.js"
import Channel from "./Channel.js"
import Navbar from "./Navbar.js"
import ChatChannel from "../channels/chat_channel"
import ChannelChannel from "../channels/channel_channel"
import Match from "./Match.js"

const Router = {};
if ($('html').data().isLogin) {
	$(() => {
		const remove_channel = function() {
			if (ChatChannel.channel)
				ChatChannel.unsubscribe();
			if (ChannelChannel.channel)
				ChannelChannel.unsubscribe();
				
			if (Chat.content)
				Chat.content.undelegateEvents();
			if (Channel.content)
				Channel.content.undelegateEvents();
		};

		const RouterClass = Backbone.Router.extend({
			routes: {
				"": "game",
				"game": "game",
				"game/duel": "game_duel",
				"profile": "profile",
				"guild": "guild",
				"chats/:room": "chat",
				"channels/:channel_id": "channel",
			},
			game: function () {
				remove_channel();
				Game.content.render();
			},
			game_duel: function() {
				remove_channel();
				Match.content = new Match.Content({ type: "duel" });
			},
			profile: function () {
				remove_channel();
				Profile.content.render();
			},
			guild: function () {
				remove_channel();
				Guild.content.render();
			},
			chat: function (room) {
				remove_channel();
				Chat.content = new Chat.Content({ room: room });
			},
			channel: function (channel_id) {
				remove_channel();
				Channel.content = new Channel.Content({ channel_id: channel_id });
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