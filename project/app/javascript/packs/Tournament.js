import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Router from "../packs/Router";
import TournamentChannel from "../channels/tournament_channel"

const Tournament = {};

if ($('html').data().isLogin) {

$(() => {
	Tournament.intervalId = null;
	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),
		events: {
			"click #tournament-join": "join_tournament",
			"click #tournament-quit": "quit_tournament",
			"click .tournament-bracket__match": "go_to_match",
		},
		page_template: _.template($("script[name='tmpl-tournament-page']").html()),
		info_template: _.template($("script[name='tmpl-tournament-info']").html()),
		tree_template: _.template($("script[name='tmpl-tournament-tree']").html()),
		participants_template: _.template($("script[name='tmpl-tournament-participants']").html()),

		initialize: async function(options){
			try {
				this.tournament_id = options.tournament_id;
				this.user_id = $('html').data().userId;
				const info = await Helper.ajax(`/api/tournaments/${this.tournament_id}`, '', 'GET');
				this.end = new Date(info.registration_end)
				this.render_page();
				this.render_info(info);
				this.render_participants(info);
				this.render_tree(info);
				this.render_timer();
				console.log(info);
				TournamentChannel.subscribe(this.tournament_id, this.recv_callback, this);
			} catch (error) {
				if (error.responseText)
					Helper.flash_message('danger', error.responseText);
				else
					console.error(error);
				// window.location.hash = '';				
			}
		},
		render_page() {
			this.$el.html(this.page_template());
		},
		render_info(data) {
			this.$el.find('#tournament-info').html(this.info_template(data));
		},
		render_participants(data) {
			this.$el.find('#tournament-participants').html(this.participants_template(data));
		},
		render_tree(data) {
			this.$el.find('#tournament-tree').html(this.tree_template(data))
		},
		render_timer: function() {
			let now = new Date();
			let distance = ((this.end - now)/1000) >> 0
			console.log('render_timer')
			if (distance < 0)
				$('#tournament-timer').html('registration finished')
			else {
				$('#tournament-timer').html(Helper.getTimeString(distance))
				setTimeout(() => {
					if ($('#tournament-timer').length) {
						this.render_timer(this.end);
					}
				}, 1000);
			}	
		},
		async join_tournament(e) {
			e.stopPropagation();
			try {
				await Helper.ajax(`/api/tournaments/${this.tournament_id}/players`, '','PUT');
			} catch (error) {
				if (error.responseText)
					Helper.flash_message('danger', error.responseText);
				else
					console.error(error);
				window.location.hash = '';
			}
		},
		async quit_tournament(e) {
			e.stopPropagation();
			try {
				await Helper.ajax(`/api/tournaments/${this.tournament_id}/players`, '', 'DELETE');
			} catch (error) {
				if (error.responseText)
					Helper.flash_message('danger', error.responseText);
				else
					console.error(error);
				window.location.hash = '';
			}
		},
		go_to_match(e) {
			e.stopPropagation();
			const match_id = $(e.currentTarget).data().matchId;
			if (!match_id)
				return;
			return Router.router.navigate(`/game/tournament/${match_id}`, { trigger: true });
		},
		async recv_callback(data) {
			console.log(data);
			if (data.type === "tree") {
				this.render_tree(data.data);
			} else if (data.type === "participant") {
				this.render_participants(data.data)
			}
		},

	});
	
})

}

export default Tournament;