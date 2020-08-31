import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"

const Tournaments = {};

if ($('html').data().isLogin) {

$(() => {
	Tournaments.Content = Backbone.View.extend({
		el: $("#app"),
		page_template: _.template($("script[name='tmpl-tournaments-page']").html()),
		list_template: _.template($("script[name='tmpl-tournaments-list']").html()),
		user_id: $('html').data().userId,
		events: {
			"click .tournament-item": "go_to_tournament",
			"submit #create-tournament-form": "create_tournament",
		},
		initialize: async function(){
			try {
				const list = await Helper.ajax('/api/tournaments', '', 'GET');
				const me = await Helper.ajax(`/api/profile/${this.user_id}`);
				this.render_page({me: me});
				this.render_list({list: list});
			} catch (error) {
				if (error.statusText)
					Helper.flash_message("danger", error.statusText);
				else
					console.error(error);
			}
		},
		render_page(data) {
			this.$el.find("#view-content").html(this.page_template(data));
		},
		render_list(data) {
			this.$el.find('#tournaments-list').html(this.list_template(data))
		},
		async create_tournament(e) {
			try {
				e.preventDefault();
				const data = $(e.currentTarget).serializeArray();
				if (data[0].value.length < 4)
					throw new Error("Tournament name is too short");
				if (data[0].value.length >= 30)
					throw new Error("Tournament name is too long");
				await Helper.ajax('/api/tournaments', $(e.currentTarget).serialize(), 'POST')
				const list = await Helper.ajax('/api/tournaments', '', 'GET');
				this.render_list({ list: list });
				$('#createTournamentModal').modal('hide')
			} catch (error) {
				if (error.statusText)
					console.error(error);
				else
					Helper.flash_message("danger", error);
			}
		},
		go_to_tournament(e) {
			e.stopImmediatePropagation();
			const id = $(e.currentTarget).data().id;
			window.location.hash = `game/tournaments/${id}`
		}
	});
})

}
export default Tournaments;