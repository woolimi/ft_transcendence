import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Router from "../packs/Router";

const Tournament = {};

if ($('html').data().isLogin) {

$(() => {
	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),
		self: this,
		events: {
			"click #button-join": "join",
			"click #button-quit": "quit",
			"click #button-test-reset": "test_reset",
			"click #start-match": "open_match",
			"click #spectate-match": "open_match"
		},
		page_template: _.template($("script[name='tmpl-tournament-page']").html()),
		// info_template: _.template($("script[name='tmpl-tournament-infos']").html()),
		tree_template: _.template($("script[name='tmpl-tournament-tree']").html()),
		// match_template: _.template($("script[name='tmpl-tournament-match']").html()),
		// participants_template: _.template($("script[name='tmpl-tournament-participants']").html()),
		// join_button_template: _.template($("script[name='tmpl-tournament-join-button']").html()),

		initialize: async function(id){
			this.id = id,
			this.user_id = $('html').data().userId;
			const info = await Helper.ajax(`/api/tournaments/${id}`, '', 'GET');
			this.render_page();
			this.render_info(info);
			this.render_tree(info);
			console.log(info);
		},
		render_page: function() {
			this.$el.html(this.page_template());
		},
		render_tree: function () {
			this.$el.find('#tournament-tree').html(this.tree_template())
		},

		render_infos: function() {
			this.$el.find('#tournament-infos').html(
				this.info_template({model: this.model.attributes})
			)
		},
		render_match: function(selector, match){
			this.$el.find(selector).html(
				this.match_template({
					match: match,
					playerNames: this.playerNames,
					user_id: this.user_id
				})
			)
		},

		get_time_string: function(distance){
			let negative = distance < 0
			distance = Math.abs(distance)
			let seconds = distance % 60;
			distance = (distance / 60) >> 0
			let minutes = distance % 60;
			distance = (distance / 60) >> 0;
			let hours = distance % 24;
			distance = (distance / 24) >> 0;
			let days = distance;
			let answer = `${days}d ${hours}h ${minutes}m ${seconds}s`
			if (negative)
				answer = answer + ' ago'
			else
				answer = 'in ' + answer
			return answer
		},

		render_timer: function() {
			var self = this
			let now = new Date();
			let distance = ((this.end - now)/1000) >> 0
			console.log('render_timer')
			$('#clock').html(this.get_time_string(distance))
			setTimeout(() => {
				if ($('#clock').length) {
					this.render_timer(self.end);
				}
			}, 1000);
		},

		render_participant_list: function(){
			this.$el.find('#participant-list').html(
				this.participants_template({users: this.model.attributes.players})
			)
		},

		render_join_button: function(){
			let users = this.model.attributes.players
			let started = (users.length === 4)
			let hasJoined = (users.find((o)=>(o.id == this.user_id))) !== undefined
			let now = new Date();
			let timeOut = (now > this.end)
			this.$el.find('#join-button').html(
				this.join_button_template({
					started: started,
					hasJoined: hasJoined,
					timeOut: timeOut
				})
			)
		},

		join: async function(e){
			var self = this
			e.preventDefault()
			e.stopImmediatePropagation();
			try {
				console.log('idi:', self.id)
				await Helper.ajax(`/api/tournaments/${self.id}/join`, '','PUT')
				await Helper.fetch(self.model)
			} catch (error) {
				Helper.flash_message("danger", error.responseText)
				console.log(error.responseText)
			}
			this.render()
		},

		quit: async function(e){
			var self = this
			e.preventDefault()
			e.stopImmediatePropagation();
			try {
				await Helper.ajax(`/api/tournaments/${self.id}/quit`, '','DELETE')
				await Helper.fetch(self.model)
			} catch (error) {
				Helper.flash_message("danger", error.responseText)
				console.log(error.responseText)
			}
			this.render()
		},

		test_reset: async function(e){
			var self = this
			e.preventDefault()
			e.stopImmediatePropagation();
			try {
				self.model.attributes = await Helper.ajax(`/api/tournaments/${self.id}/test_reset`, '','PUT')
				// await Helper.fetch(self.model)
			} catch (error) {
				Helper.flash_message("danger", error.responseText)
				console.log(error.responseText)
			}
			self.render()
		},

		open_match: function(e){
			e.preventDefault()
			e.stopImmediatePropagation();
			let match_id = $(e.target).data().match_id
			Router.router.navigate(`/game/tournaments/${this.id}/${match_id}`, { trigger: true });
		}
	});
	
})

}

export default Tournament;