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
import Match from "./Match.js"
import MatchChannel from "../channels/match_channel.js"
import War from "./War.js"
import WarHistory from "./WarHistory.js"
import UserStatusChannel from "../channels/user_status_channel"
import GameChannel from "../channels/game_channel"
import Ladder from "./Ladder"
import TournamentChannel from "../channels/tournament_channel.js"
import GuildChannel from "../channels/guild_channel"
import Admin from "./Admin"
import AdminGuildRights from "./AdminGuildRights"
import Duel from "./Duel.js"
import Pong from "./Pong"

const Router = {};
if ($('html').data().isLogin) {
    $(() => {
        const urlHistory = [];
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
            if (War.content) {
                clearInterval(War.content.intervalId);
                War.content.undelegateEvents();
            }
            if (GameChannel.channel)
                GameChannel.unsubscribe();
            if (Game.content)
                Game.content.undelegateEvents();
            if (Guild.content)
                Guild.content.undelegateEvents();
            if (War.content)
                War.content.undelegateEvents();
            if (Tournaments.content)
                Tournaments.content.undelegateEvents();
            if (Tournament.content)
                Tournament.content.undelegateEvents();
            if (Admin.content)
                Admin.content.undelegateEvents()
            if (AdminGuildRights.content)
                AdminGuildRights.content.undelegateEvents()
            if (TournamentChannel.channel)
                TournamentChannel.unsubscribe();
            if (GuildChannel.channel)
                GuildChannel.unsubscribe();

            $(window).off("resize");
            urlHistory.push(location.hash);
            if (urlHistory.length > 2) {
                urlHistory.splice(0, urlHistory.length - 2)
            };
            Pong.off();
        };

        const RouterClass = Backbone.Router.extend({
            routes: {
                "": "game",
                "game": "game",
                "game/duel": "duel",
                "game/ladder": "ladder",
                "game/tournaments": "tournaments",
                "game/tournaments/:tournament_id": "tournament",
                "game/:match_type/:match_id": "match",
                "profile": "profile",
                "guild": "guild",
                "guild/war_history/:guild_name/:guild_id": "guildHistory",
                "chats/:room": "chat",
                "channels/:channel_id": "channel",
                "game/war": "war",
                "war": "war",
                "admin": "admin",
                "admin/guildRights/:guild_id": "adminGuildRights",
            },
            game() {
                remove_channel();
                Game.content = new Game.Content();
            },
            duel() {
                remove_channel();
                Duel.content = new Duel.Content();
            },
            match(match_type, match_id) {
                remove_channel();
                Match.content = new Match.Content({ match_type: match_type, id: match_id });
            },
            profile() {
                remove_channel();
                Profile.content = new Profile.Content();
                Profile.content.render();
            },
            guild() {
                remove_channel();
                Guild.content = new Guild.Content();
                Guild.content.render();
            },
            guildHistory: function(guild_name, guild_id) {
                WarHistory.histView = new WarHistory.HistContent({ guild_id: guild_id, guild_name: guild_name });
            },
            chat(room) {
                remove_channel();
                Chat.content = new Chat.Content({ room: room });
            },
            channel(channel_id) {
                remove_channel();
                Channel.content = new Channel.Content({ channel_id: channel_id });
            },
            war() {
                remove_channel();
                War.content = new War.Content();
            },
            tournaments(){
                remove_channel();
                Tournaments.content = new Tournaments.Content();
            },
            tournament(tournament_id){
                remove_channel();
                Tournament.content = new Tournament.Content({ tournament_id: tournament_id});
            },
            ladder() {
                remove_channel();
                Ladder.content = new Ladder.Content(); 
            },
            admin() {
                remove_channel();
                Admin.content = new Admin.Content(); 
            },
            adminGuildRights(guild_id){
                remove_channel();
                AdminGuildRights.content = new AdminGuildRights.Content({guild_id: guild_id}); 
            },
        });
        Router.router = new RouterClass();
        Router.router.on("route", function(curRoute, params) {
            Navbar.currentRoute.set({ route: curRoute });
        });

        UserStatusChannel.subscribe();
    });
}

export default Router;