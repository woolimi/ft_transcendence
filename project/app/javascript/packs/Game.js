import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"

const Game = {};

$(() => {
	Game.Content = Backbone.View.extend({
		el: $("#view-content"),
		index_template: _.template($("script[name='tmpl-game-index']").html()),
		render: function () {
			this.$el.html(this.index_template());
			return this;
		},
		events: {
			"click .game-type": "move_page",
		},
		move_page: function(e) {
			e.stopImmediatePropagation();
			const link = $(e.currentTarget).data().link;
			window.location.hash = `game/${link}`;
		}
	});
	Game.content = new Game.Content();
})

export default Game;