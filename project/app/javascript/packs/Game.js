import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import GameChannel from "../channels/game_channel"
import Helper from "./Helper";

const Game = {};

if ($('html').data().isLogin) {
    
$(() => {
    Game.Content = Backbone.View.extend({
        el: $("#view-content"),
        page_template: _.template($("script[name='tmpl-game-index']").html()),
        list_template: _.template($("script[name='tmpl-ingame-list']").html()),
        events: {
            "click .game-type": "move_page",
            "click .ingame-match": "watch_match"
        },
        async initialize() {
            try {
                this.render_page();
                const list = await Helper.ajax(`/api/matches`, '', 'GET');
                this.render_list({ list: list });
                GameChannel.subscribe(this.recv_callback, this);                
            } catch (error) {
                console.error(error);
            }
        },
        async recv_callback(data) {
            if (data.type == "match") {
                const list = await Helper.ajax(`/api/matches`, '', 'GET');
                console.log(list);
                this.render_list({ list: list });
            }
        },
        render_page() {
            this.$el.html(this.page_template());
        },
        render_list(data) {
            this.$el.find("#game-ingame-list").html(this.list_template(data));
        },
        move_page(e) {
            e.stopImmediatePropagation();
            const link = $(e.currentTarget).data().link;
            window.location.hash = `game/${link}`;
        },
        watch_match(e) {
            e.stopImmediatePropagation();
            const match = $(e.currentTarget).data();
            window.location.hash = `game/${match.matchType}/${match.matchId}`;
        }
    });
})

}
export default Game;