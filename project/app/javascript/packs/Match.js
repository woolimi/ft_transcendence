import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import { Pong } from "./Pong.js"
import MatchChannel from '../channels/match_channel'
import UserStatusChannel from "../channels/user_status_channel.js"

const Match = {};

if ($('html').data().isLogin) {

$(() => {
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
				this.user_id = $('html').data().userId;
				this.options = options; // { match_type: "duel", id: match_id }
				// match_data = {id: "", match_type: "", player1: {}, plyaer2: {} }
				const match_data = await Helper.ajax(`/api/matches/${options.id}`, '','GET');
				this.render_page();
				this.render_players(match_data);
				this.render_game(match_data);
				MatchChannel.subscribe(match_data, this.recv_callback, this);
				const wrapper = document.getElementById("game-screen-wrapper");
				const canvas = document.getElementById("game-screen");
				this.pong = new Pong(wrapper, canvas, options.id);
				if (match_data.started_at	&& !match_data.match_finished
					&& (this.user_id == match_data.player_left_id || this.user_id == match_data.player_right_id))
					this.pong.on();
				UserStatusChannel.channel.perform("set_status", { user_id: this.user_id, status: 2 });
			} catch (error) {
				console.error(error);
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
		async recv_callback(data) {
			try {
				// if data is come from me, ignore
				if (data.from === this.user_id)
					return;
				// new user enter into room
				if (data.ready) {
					$(`#player${data.nb_player}-ready-status`).html(data.ready_status ? "Ready" : "Not Ready");
					return;
				}

				if (data.all_ready) {
					// disable ready button
					$('.ready-status')[0].disabled = true;
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
					const match_data = await Helper.ajax(`/api/matches/${this.options.id}`, '', 'GET');
					this.render_players(match_data);
					return;
				}

				if (data.players) {
					const match_data = await Helper.ajax(`/api/matches/${this.options.id}`, '', 'GET');
					this.render_players(match_data);
					return;
				}

				if (data.score) {
					$("#player1-score").html(data.score[0]);
					$("#player2-score").html(data.score[1]);
					return;
				}
			} catch (error) {
				console.error(error);
			}
		}
	});
})

}

export default Match;