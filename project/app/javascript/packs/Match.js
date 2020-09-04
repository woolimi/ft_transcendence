import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import { Pong } from "./Pong.js"
import MatchChannel from '../channels/match_channel'
import UserStatusChannel from "../channels/user_status_channel.js"
import Helper from "./Helper.js"

const Match = {};

if ($('html').data().isLogin) {

$(() => {

	Match.canvas = null;
	Match.wrapper = null;
	Match.id = null;
	Match.Content = Backbone.View.extend({
		el: $("#view-content"),
		page_template: _.template($("script[name='tmpl-game-page']").html()),
		players_template: _.template($("script[name='tmpl-game-players']").html()),
		game_template: _.template($("script[name='tmpl-game-game']").html()),
		render_page: function () {
			this.$el.html(this.page_template());
		},
		render_players: function(data) {
			this.$el.find('#game-players').html(this.players_template(data));
		},
		render_game: function (data) {
			this.$el.find('#game-game').html(this.game_template(data));
		},
		events: {
			"click .ready-status": "check_ready", 
		},
		initialize: async function(options) {
			try {
				Match.id = options.id;
				this.user_id = $('html').data().userId;
				this.options = options; // { match_type: "duel", id: match_id }
				const match_data = await Helper.ajax(`/api/matches/${options.id}`, '','GET');
				// if (match_data.match_finished)
				// 	throw "match finished";
				this.render_page();
				this.render_players(match_data);
				this.render_game(match_data);
				Match.wrapper = document.getElementById("game-screen-wrapper");
				Match.canvas = document.getElementById("game-screen");
				this.pong = new Pong(options.id);
				if (match_data.started_at	&& !match_data.match_finished
					&& (this.user_id == match_data.player_left_id || this.user_id == match_data.player_right_id)) {
					this.pong.on();
				}
				MatchChannel.subscribe(match_data, this.recv_callback, this);
				// console.log(match_data)
				// if ((match_data.player_1 && match_data.player_1.user_id == this.user_id)
				// 	|| (match_data.player_2 && match_data.player_2.user_id == this.user_id))
				// 	UserStatusChannel.channel.perform("set_status", { user_id: this.user_id, status: 2 });
				
			} catch (error) {
				if (error.responseText)
					Helper.flash_message("danger", error.responseText);
				else {
					Helper.flash_message("danger", error);
				}
				window.history.back();
			}
		},
		check_ready(e) {
			e.stopImmediatePropagation();
			const data = $(e.currentTarget).data();
			if (data.userId === this.user_id) {
				const nbPlayer = data.nbPlayer;
				MatchChannel.channel.perform("ready", {
					ready: true,
					match_id: this.options.id,
					ready_status: $(e.currentTarget)[0].checked,
					nb_player: nbPlayer,
				});
			}
		},
		recv_callback(data) {
			if (data.ready) {
				$(`#player${data.nb_player}-ready-status`).html(data.ready_status ? "Ready" : "Not Ready");
				return;
			}

			if (data.all_ready) {
				$('.ready-status').addClass('d-none');
				this.pong.on();
				return;
			}

			if (data.count_down) {
				$("#game-timer").removeClass("d-none")
				$("#game-timer").html(data.count);
				if (data.count === "GO!") {
					setTimeout(()=> {
						$("#game-timer").addClass("d-none")
					}, 800)
				}
				return;
			}

			if (data.ball) {
				this.pong.update(data);
				this.pong.draw();
				return;
			}

			if (data.end) {
				this.pong.off();
				this.render_players(data.data);
				return;
			}

			if (data.players) {
				this.render_players(data.data);
				return;
			}

			if (data.score) {
				$("#player1-score").html(data.score[0]);
				$("#player2-score").html(data.score[1]);
				return;
			}
		}
	});
})

}

export default Match;