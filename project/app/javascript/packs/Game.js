import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Game = {};

if ($('html').data().isLogin) {
    
$(() => {
    Game.Content = Backbone.View.extend({
        el: $("#view-content"),
        page_template: _.template($("script[name='tmpl-game-index']").html()),
        list_template: _.template($("script[name='tmpl-ingame-list']").html()),
        async initialize() {
            try {
                this.render_page();
                this.render_list();                
            } catch (error) {
                console.log(error);
            }
        },
        render_page: function() {
            this.$el.html(this.page_template());
        },
        render_list: function(data) {
            this.$el.find("#game-ingame-list").html(this.list_template(data));
        },
        events: {
            "click .game-type": "move_page",
        },
        move_page: function(e) {
            e.stopImmediatePropagation();
            const link = $(e.currentTarget).data().link;
            window.location.hash = `game/${link}`;
        },
    });
})

}
export default Game;