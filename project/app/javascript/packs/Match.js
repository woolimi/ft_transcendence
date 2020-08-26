import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import { Game, keyListener } from "./Pong.js"
import MatchChannel from '../channels/match_channel'

const Match = {};

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
		render_game: function() {
			this.$el.find('#game-game').html(this.game_template());
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
				this.render_game();
				MatchChannel.subscribe(match_data, this.recv_callback, this);
			} catch (error) {
				console.error(error);
			}
			const wrapper = document.getElementById("game-screen-wrapper");
			const canvas = document.getElementById("game-screen");
			this.game = new Game(wrapper, canvas);
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
				if (data.players) {
					const match_data = await Helper.ajax(`/api/matches/${this.options.id}`, '', 'GET');
					this.render_players(match_data);
					return;
				}
				if (data.ready) {
					$(`#player${data.nb_player}-ready-status`).html(data.ready_status ? "Ready" : "Not Ready");
					return;
				}

				if (data.all_ready) {
					// disable ready button
					$('.ready-status')[0].disabled = true;
					// keyListener.on();
					// keyListener on
					// resize event on
					// 
					return;
				}

				if (data.count_down) {
					$("#timer").html(data.count);
					return;
				}

				if (data.ball) {
					this.game.update(data);
					this.game.draw();
				}

			} catch (error) {
				console.error(error);
			}
		}
	});
})

export default Match;