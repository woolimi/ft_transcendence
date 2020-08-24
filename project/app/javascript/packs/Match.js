import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import { Game, keyListener } from "./Pong.js"

const Match = {};

$(() => {
	Match.Content = Backbone.View.extend({
		el: $("#view-content"),
		page_template: _.template($("script[name='tmpl-game-match']").html()),
		render_page: function () {
			this.$el.html(this.page_template());
			return this;
		},
		events: {
			"click .ready-status": "check_ready", 
		},
		initialize: function(options) {
			this.options = options; // { type: "duel", ... }
			this.render_page();
			const timer = document.getElementById("timer");
			const wrapper = document.getElementById("game-screen-wrapper");
			const canvas = document.getElementById("game-screen");
			Match.game = new Game(timer, wrapper, canvas);
		},
		check_ready: function(e) {
			e.stopImmediatePropagation();
			const status = this.$el.find(".ready-status");
			if (status[0].checked && status[1].checked) {
				status.attr("disabled", true);
				Match.game.start();
			}
		}
	});
})

export default Match;