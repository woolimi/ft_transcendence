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
        },
        async initialize() {
            try {
                this.render_page();
                this.render_list();
                GameChannel.subscribe(this.recv_callback, this);                
            } catch (error) {
                console.log(error);
            }
        },
        recv_callback(data) {
            console.log(data);
        },
        render_page: function () {
            this.$el.html(this.page_template());
        },
        render_list: function (data) {
            this.$el.find("#game-ingame-list").html(this.list_template(data));
        },
        move_page: function (e) {
            e.stopImmediatePropagation();
            const link = $(e.currentTarget).data().link;
            window.location.hash = `game/${link}`;
        },
    });
})

}
export default Game;