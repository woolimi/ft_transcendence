import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Pong from "./Pong.js"
import MatchChannel from '../channels/match_channel'
import Helper from "./Helper.js"
import UserStatusChannel from '../channels/user_status_channel'

const Match = {};

if ($('html').data().isLogin) {

$(() => {

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
				window.id = Match.id
				this.user_id = $('html').data().userId;
				window.user_id = this.user_id
				this.options = options; // { match_type: "duel", id: match_id }
				const match_data = await Helper.ajax(`/api/matches/${options.id}`, '','GET');
				this.render_page();
				this.render_players(match_data);
				this.render_game(match_data);
				Pong.setup()				
				if(!match_data.match_finished && (this.user_id == match_data.player_left_id || this.user_id == match_data.player_right_id)) {
					Pong.on();
				}
				MatchChannel.subscribe(match_data, this.recv_callback, this);		
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
				Pong.on();
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
				Pong.update(data);
				Pong.draw();
				return;
			}

			if (data.end) {
				Pong.off();
				this.render_players(data.data);
				if (data.unanswered) {
					Helper.flash_message("success", "Other guild didn't answered. You Win !")
				}
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