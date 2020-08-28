import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Tournament from "./Tournament.js";

const Tournaments = {};

$(() => {
	const TournamentsCollection = Backbone.Collection.extend({
		url: "/api/tournaments"
	});

	Tournaments.collection = new TournamentsCollection();

	Tournaments.Content = Backbone.View.extend({
		el: $("#view-content"),
		page_template: _.template($("script[name='tmpl-tournaments-page']").html()),
		list_template: _.template($("script[name='tmpl-tournaments-list']").html()),
		tournamentsList_backbone: Tournaments.collection,
		events: {
			"click .tournamentItem": "go_to_tournament"
		},
		initialize: async function(){
			try {
				await Helper.fetch(this.tournamentsList_backbone)
				this.tournamentList = this.tournamentsList_backbone.toJSON();
				this.render_page();
				this.render_list();				
			} catch (error) {
				console.error(error);
			}
		},
		render_page() {
			this.$el.html(this.page_template());
		},
		render_list() {
			this.$el.find('#tournaments-list').html(this.list_template({list: this.tournamentList}))
		},
		go_to_tournament(e) {
			e.stopImmediatePropagation();
			const id = $(e.currentTarget).data().id;
			window.location.hash = `game/tournaments/${id}`
		},
		render: async function () {
			// contentElem.html(tournament.name)
			// if(tournament.status == 'finished'){
			// 	contentElem.css('background-color','#7c7e7c')
			// 	contentElem.css('border','#484848 5px solid')
			// } else if (tournament.status == 'pending'){
			// 	contentElem.css('background-color', '#19d81f')
			// 	contentElem.css('border', '5px solid #008814')
			// } else if (tournament.status == 'started'){
			// 	contentElem.css('background-color', '#ff9b22')
			// 	contentElem.css('border', '5px solid #a95d01')
			// }
		}
	});
})

export default Tournaments;