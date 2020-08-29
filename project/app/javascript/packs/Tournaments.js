import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Tournament from "./Tournament.js";

const Tournaments = {};

if ($('html').data().isLogin) {

$(() => {
	const TournamentsCollection = Backbone.Collection.extend({
		url: "/api/tournaments"
	});

	Tournaments.collection = new TournamentsCollection();

	Tournaments.Content = Backbone.View.extend({
		el: $("#view-content"),
		page_template: _.template($("script[name='tmpl-tournaments-page']").html()),
		list_template: _.template($("script[name='tmpl-tournaments-list']").html()),
		button_template: _.template($("script[name='tmpl-tournaments-button']").html()),
		tournamentsList: Tournaments.collection,
		user_id: $('html').data().userId,
		events: {
			"click .tournamentItem": "go_to_tournament"
		},
		initialize: async function(){
			try {
				await Helper.fetch(this.tournamentsList)
				this.render_page();
				this.render_list();
				this.render_create_button();
			} catch (error) {
				console.error(error);
			}
		},
		render_page() {
			this.$el.html(this.page_template());
		},
		render_list() {
			this.$el.find('#tournaments-list').html(this.list_template({list: this.tournamentsList.toJSON()}))
		},
		render_create_button: async function () {
			let me = await Helper.ajax(`/api/profile/${this.user_id}`)
			if(me.admin){
				this.$el.find('#tournament-add-button').html(this.button_template())
				let button = this.$el.find('#create-tournament-button')
				button.on('click', async () => {
					$('#createTournamentModal').modal('show')
					$('button[type=submit]').on('click', async (e) =>{
						e.preventDefault()
						e.stopImmediatePropagation();
						// const form = $("#create-tournament-form");
						// const data = form.serializeArray();
						// const sdata = form.serialize();
						// await Helper.ajax('/api/tournaments', sdata, 'POST')

						let name = $('#tournament-name').val()
						// let registrationStart = Date.now().getTime() / 1000;
						// let registrationEnd = dateStart + (60*60);
						try{
							await Helper.ajax('/api/tournaments', { name: name }, 'POST')
							await Helper.fetch(this.tournamentsList);
							this.render_list();
						} catch (error) {
							Helper.flash_message("danger", error.responseText)
						}
						$('#createTournamentModal').modal('hide')
					})
				})
				this.$el.find('#tournaments-list').html(this.list_template({list: this.tournamentsList.toJSON()}))
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