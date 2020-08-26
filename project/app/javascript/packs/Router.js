import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Game from "./Game.js"
import Guild from "./Guild.js"
import Profile from "./Profile.js"
import Chat from "./Chat.js"
import Channel from "./Channel.js"
import Navbar from "./Navbar.js"
import Tournaments from "./Tournaments.js"
import Tournament from "./Tournament.js"
import ChatChannel from "../channels/chat_channel"
import ChannelChannel from "../channels/channel_channel"
import War from "./War.js"

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
				"profile": "profile",
				"guild": "guild",
				"chats/:room": "chat",
				"channels/:channel_id": "channel",
				"war" :"war",
				"tournaments/:id": "tournament",
				"tournaments": "tournaments"
			},
			game: function () {
				remove_channel();
				Game.content.render();
			},
			profile: function () {
				remove_channel();
				Profile.content = new Profile.Content();
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
			},
			war: function () {
				War.content.render();
			},
			tournaments: function(){
				remove_channel();
				Tournaments.content.render();
			},
			tournament: function(id){
				remove_channel();
				Tournament.content = new Tournament.Content(id);
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