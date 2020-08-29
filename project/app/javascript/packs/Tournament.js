import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"

const Tournament = {};

if ($('html').data().isLogin) {

$(() => {
	const TournamentModel = Backbone.Model.extend({
		urlRoot: "/api/tournaments/" 
		// Backbone.history.fragment.split("/")[1];
	});

	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),
		self: this,
		events: {
			"click #button-join": "join",
			"click #button-quit": "quit"
		},

		page_template: _.template($("script[name='tmpl-tournament-page']").html()),
		info_template: _.template($("script[name='tmpl-tournament-infos']").html()),
		tree_template: _.template($("script[name='tmpl-tournament-tree']").html()),
		match_template: _.template($("script[name='tmpl-tournament-match']").html()),
		participants_template: _.template($("script[name='tmpl-tournament-participants']").html()),
		join_button_template: _.template($("script[name='tmpl-tournament-join-button']").html()),

		preinitialize: async function(id){
			this.id = id,
			this.user_id = $('html').data().userId,
			this.model = new TournamentModel({id: id})
			await Helper.fetch(this.model)
			// console.log(this.model.attributes)
			this.playerNames = {}
			for(let i=0; i < 4; i++){
				if(this.model.attributes.players[i])
					this.playerNames[this.model.attributes.players[i].id] = this.model.attributes.players[i].name
			}
			this.render_page()
			this.render_infos()
			this.render_tree()
			this.render_join_button()
			this.render_participant_list()
			this.render_timer(this.model.attributes.registration_end)
		},

		render_page() {
			this.$el.html(this.page_template());
		},

		render_infos() {
			this.$el.find('#tournament-infos').html(
				this.info_template({model: this.model.attributes})
			)
		},

		render_tree() {
			this.$el.find('#tournament-tree').html(
				this.tree_template()
			)
			this.render_match('#semi-final-1', this.model.attributes.semis[0])
			this.render_match('#semi-final-2', this.model.attributes.semis[1])
			this.render_match('#final', this.model.attributes.final)
		},

		render_match(selector, match){
			this.$el.find(selector).html(
				this.match_template({
					match: match,
					playerNames: this.playerNames
				})
			)
		},

		render_timer(end_date) {
			this.intervalId = setInterval(function() {
					var dds = new Date(end_date);
					var countDownDate = dds.getTime();
					var now = Date.now();

					var distance = countDownDate - now;
					var days = Math.floor(distance / (1000 * 60 * 60 * 24));
					var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					var seconds = Math.floor((distance % (1000 * 60)) / 1000);
					if (distance < 0) {
						clearInterval(this.intervalId);
						$('#clock').html("Registration time has passed.");
					} else {
						$('#clock').html(days + "d " + hours + "h " +
						minutes + "m " + seconds + "s ")
					}
			}, 1000);
		},

		render_participant_list(){
			this.$el.find('#participant-list').html(
				this.participants_template({users: this.model.attributes.players})
			)
		},

		render_join_button(){
			let users = this.model.attributes.players
			let started = (users.length === 4)
			let hasJoined = (users.find((o)=>(o.id == this.user_id))) !== undefined
			this.$el.find('#join-button').html(
				this.join_button_template({
					started: started,
					hasJoined: hasJoined
				})
			)
		},

		async join(e){
			e.preventDefault()
			e.stopImmediatePropagation();
			try {
				await Helper.ajax(`/api/tournaments/${this.id}/join`, '','PUT')
				await Helper.fetch(this.model)
			} catch (error) {
				Helper.flash_message("danger", error.responseText)
				// console.log(error.responseText)
			}
			this.render_participant_list()
			this.render_join_button()
		},

		async quit(e){
			e.preventDefault()
			e.stopImmediatePropagation();
			try {
				await Helper.ajax(`/api/tournaments/${this.id}/quit`, '','DELETE')
				await Helper.fetch(this.model)
			} catch (error) {
				Helper.flash_message("danger", error.responseText)
				// console.log(error.responseText)
			}
			this.render_participant_list()
			this.render_join_button()
		},
	});
	
})

}

export default Tournament;