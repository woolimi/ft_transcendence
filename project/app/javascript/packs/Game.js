import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"

const Game = {};

$(() => {
	const GameContent = Backbone.View.extend({
		el: $("#view-content"),
		events: {
			"click #tournaments": "go_to_tournaments_page",
			// "click #war": "goToWarPage",
		},
		template: _.template($("script[name='tmpl-content-game']").html()),
		render: function () {
			const content = this.template();
			this.$el.html(content);
			return this;
		},
		// goToWarPage: function () {
		// 	console.log("War page");
		// },
		go_to_tournaments_page: function(e){
			e.stopImmediatePropagation()
			Router.router.navigate("/tournaments", { trigger: true });
		}
	});

	Game.content = new GameContent();
})

export default Game;