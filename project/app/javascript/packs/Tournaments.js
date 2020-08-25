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
			let content = $('<div/>',{
				class: 'tournamentList'
			})
			for(const tournament of tournaments){
				// content += `<li><a href='#tournaments/${tournament.id}'>
				//             ${tournament.name}</li>`
				let contentElem = $('<div/>',{
					class: 'tournamentItem'
				})
				contentElem.on('click', ()=>{
					location.href = `#tournaments/${tournament.id}`;
				})
				contentElem.html(tournament.name)
				if(tournament.status == 'finished'){
					contentElem.css('background-color','#7c7e7c')
					contentElem.css('border','#484848 5px solid')
				} else if (tournament.status == 'running'){
					contentElem.css('background-color', '#19d81f')
					contentElem.css('border', '5px solid #008814')
				}
				content.append(contentElem)
			}
			this.$el.html('');
			this.$el.append(content)
			return this;
		}
	});
	
	Tournaments.content = new TournamentsContent();
})

export default Tournaments;