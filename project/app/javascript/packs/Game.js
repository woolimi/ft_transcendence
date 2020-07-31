import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Game = {};

$(() => {
	const GameContent = Backbone.View.extend({
		el: $("#view-content"),
		template: _.template($("script[name='tmpl-content-game']").html()),
		render: function () {
			const content = this.template();
			this.$el.html(content);
			return this;
		}
	});

	Game.content = new GameContent();
})

export default Game;