import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Tournaments = {};

$(() => {

	const TournamentsContent = Backbone.View.extend({
		el: $("#view-content"),
		// template: _.template($("script[name='tmpl-tournaments-list']").html()),
		getTournaments(){
			// todo : Backbone.collection, then Helper.fetch() or Helper.ajax
			return [{id: 1, name: 'Tournament for heroes', status: 'finished'},
							{id: 2, name: 'Tournament of the century', status: 'running'}]
		},
		render: function () {
			// const content = this.template();
			let tournaments = this.getTournaments();
			let content = '<ul>'
			for(const tournament of tournaments){
				content += `<li><a href='#tournaments/${tournament.id}'>
				            ${tournament.name}</li>`
			}
			content += '</ul>'
			this.$el.html(content);
			return this;
		}
	});
	
	Tournaments.content = new TournamentsContent();
})

export default Tournaments;