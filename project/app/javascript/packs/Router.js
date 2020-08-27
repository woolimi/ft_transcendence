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
import MatchChannel from "../channels/match_channel.js"

const Router = {};
if ($('html').data().isLogin) {
	$(() => {
		const remove_channel = function() {
			if (ChatChannel.channel)
				ChatChannel.unsubscribe();
			if (ChannelChannel.channel)
				ChannelChannel.unsubscribe();
			if (MatchChannel.channel)
				MatchChannel.unsubscribe();

			if (Chat.content)
				Chat.content.undelegateEvents();
			if (Channel.content)
				Channel.content.undelegateEvents();
			if (Match.content)
				Match.content.undelegateEvents();
			$(window).off("resize");
		};

		const urlHistory = [];
		const RouterClass = Backbone.Router.extend({
			routes: {
				"": "game",
				"game": "game",
				"game/duel": "game_duel",
				"game/duel/:match_id": "game_duel",
				"profile": "profile",
				"guild": "guild",
				"chats/:room": "chat",
				"channels/:channel_id": "channel",
			},
			game: function () {
				remove_channel();
				Game.content.render();
			},
			game_duel: async function(match_id) {
				remove_channel();
				if (urlHistory[0] && urlHistory[0].indexOf("#game/duel/") > -1)
					return Router.router.navigate(`/`, { trigger: true });
				if (performance.getEntriesByType("navigation")[0].type === "reload")
					return Router.router.navigate(`/`, { trigger: true });
				if (!match_id) {
					const new_match = await Helper.ajax('/api/matches/', `match_type=duel`, 'POST');
					return Router.router.navigate(`/game/duel/${new_match.id}`, { trigger: true });
				}
				Match.content = new Match.Content({ match_type: "duel", id: match_id });
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
			}
		});
		const router = new RouterClass();
		Router.router = router;

		$(window).on('hashchange', function (e) {
			urlHistory.push(location.hash);
			if (urlHistory.length > 2) {
				urlHistory.splice(0, urlHistory.length - 2)
			};
		});

		Router.router.on("route", function (curRoute, params) {
			Navbar.currentRoute.set({ route: curRoute });
		});
	});
}

export default Router;