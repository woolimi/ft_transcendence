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
import Admin from "./Admin"
import AdminGuildRights from "./AdminGuildRights"


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
            if (War.content)
                clearInterval(War.content.intervalId);
            if (GameChannel.channel)
                GameChannel.unsubscribe();
            if (Game.content)
                Game.content.undelegateEvents();
            if (Tournaments.content)
                Tournaments.content.undelegateEvents();
            if (Tournament.content) {
                Tournament.content.undelegateEvents();
                clearInterval(Tournament.intervalId);
                Tournament.intervalId = null;
            }
            if (Admin.content)
                Admin.content.undelegateEvents()
            if (AdminGuildRights.content)
                Admin.content.undelegateEvents()
            if (TournamentChannel.channel)
                TournamentChannel.unsubscribe();

            $(window).off("resize");
        };

        const urlHistory = [];
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
                "guild/war_history/:guild_id": "guildHistory",
                "chats/:room": "chat",
                "channels/:channel_id": "channel",
                "war": "war",
                "admin": "admin",
                "admin/guildRights/:guild_id": "adminGuildRights",
            },
            game() {
                remove_channel();
                Game.content = new Game.Content();
            },
            async duel() {
                remove_channel();
                try {
                    const new_match = await Helper.ajax('/api/matches/', `match_type=duel`, 'POST');
                    return Router.router.navigate(`/game/duel/${new_match.id}`, { trigger: true });
                } catch (error) {
                    console.error(error);
                }
            },
            async match(match_type, match_id) {
                remove_channel();
                if (urlHistory[0] && urlHistory[0].indexOf(`#game/${match_type}/`) > -1) {
                    console.log('here')
                    return Router.router.navigate(`/`, { trigger: true });
                }
                if (performance.getEntriesByType("navigation")[0].type === "reload")
                    return Router.router.navigate(`/`, { trigger: true });
                Match.content = new Match.Content({ match_type: match_type, id: match_id });
            },
            profile() {
                remove_channel();
                Profile.content = new Profile.Content();
                Profile.content.render();
            },
            guild() {
                remove_channel();
                Guild.content.render();
            },
            guildHistory(guild_id) {
                WarHistory.histView = new WarHistory.HistContent({ guild_id: guild_id });
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
        const router = new RouterClass();
        Router.router = router;

        $(window).on('hashchange', function(e) {
            urlHistory.push(location.hash);
            if (urlHistory.length > 2) {
                urlHistory.splice(0, urlHistory.length - 2)
            };
        });

        Router.router.on("route", function(curRoute, params) {
            Navbar.currentRoute.set({ route: curRoute });
        });

        UserStatusChannel.subscribe();
    });
}

export default Router;