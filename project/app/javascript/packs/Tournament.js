import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Router from "../packs/Router";

const Tournament = {};

if ($('html').data().isLogin) {

$(() => {
	Tournament.intervalId = null;
	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),
		events: {
		},
		page_template: _.template($("script[name='tmpl-tournament-page']").html()),
		info_template: _.template($("script[name='tmpl-tournament-info']").html()),
		tree_template: _.template($("script[name='tmpl-tournament-tree']").html()),
		participants_template: _.template($("script[name='tmpl-tournament-participants']").html()),

		initialize: async function(tournament_id){
			this.tournament_id = tournament_id,
			this.user_id = $('html').data().userId;
			const info = await Helper.ajax(`/api/tournaments/${tournament_id}`, '', 'GET');
			this.render_page();
			this.render_info(info);
			this.render_participants(info);
			this.render_tree(info);
			this.render_timer();
			console.log(info);
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
		render_timer() {
			clearInterval(Tournament.intervalId);
			Tournament.intervalId = setInterval(() => {
				const sec = $('#tournament-timer').data().sec;
				$('#tournament-timer').html(Helper.getTimeString(sec));
				$('#tournament-timer').data().sec -= 1;
			}, 1000);
		},


		// render_timer: function() {
		// 	let now = new Date();
		// 	let distance = ((this.end - now)/1000) >> 0
		// 	console.log('render_timer')
		// 	$('#clock').html(this.get_time_string(distance))
		// 	setTimeout(() => {
		// 		if ($('#clock').length) {
		// 			this.render_timer(self.end);
		// 		}
		// 	}, 1000);
		// },

		// render_participant_list: function(){
		// 	this.$el.find('#participant-list').html(
		// 		this.participants_template({users: this.model.attributes.players})
		// 	)
		// },

		// render_join_button: function(){
		// 	let users = this.model.attributes.players
		// 	let started = (users.length === 4)
		// 	let hasJoined = (users.find((o)=>(o.id == this.user_id))) !== undefined
		// 	let now = new Date();
		// 	let timeOut = (now > this.end)
		// 	this.$el.find('#join-button').html(
		// 		this.join_button_template({
		// 			started: started,
		// 			hasJoined: hasJoined,
		// 			timeOut: timeOut
		// 		})
		// 	)
		// },

		// join: async function(e){
		// 	var self = this
		// 	e.preventDefault()
		// 	e.stopImmediatePropagation();
		// 	try {
		// 		console.log('idi:', self.id)
		// 		await Helper.ajax(`/api/tournaments/${self.id}/join`, '','PUT')
		// 		await Helper.fetch(self.model)
		// 	} catch (error) {
		// 		Helper.flash_message("danger", error.responseText)
		// 		console.log(error.responseText)
		// 	}
		// 	this.render()
		// },

		// quit: async function(e){
		// 	var self = this
		// 	e.preventDefault()
		// 	e.stopImmediatePropagation();
		// 	try {
		// 		await Helper.ajax(`/api/tournaments/${self.id}/quit`, '','DELETE')
		// 		await Helper.fetch(self.model)
		// 	} catch (error) {
		// 		Helper.flash_message("danger", error.responseText)
		// 		console.log(error.responseText)
		// 	}
		// 	this.render()
		// },

		// test_reset: async function(e){
		// 	var self = this
		// 	e.preventDefault()
		// 	e.stopImmediatePropagation();
		// 	try {
		// 		self.model.attributes = await Helper.ajax(`/api/tournaments/${self.id}/test_reset`, '','PUT')
		// 		// await Helper.fetch(self.model)
		// 	} catch (error) {
		// 		Helper.flash_message("danger", error.responseText)
		// 		console.log(error.responseText)
		// 	}
		// 	self.render()
		// },

		// open_match: function(e){
		// 	e.preventDefault()
		// 	e.stopImmediatePropagation();
		// 	let match_id = $(e.target).data().match_id
		// 	Router.router.navigate(`/game/tournaments/${this.id}/${match_id}`, { trigger: true });
		// }
	});
	
})

}

export default Tournament;