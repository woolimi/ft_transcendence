import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"

const Tournaments = {};

$(() => {
	const TournamentsCollection = Backbone.Collection.extend({
		url: "/api/tournaments"
	});

	Tournaments.collection = new TournamentsCollection();

	const TournamentsContent = Backbone.View.extend({
		el: $("#view-content"),
		tournamentsList_backbone: Tournaments.collection,
		tournamentList:[],
		initialize: async function(){
			// debugger
			await Helper.fetch(this.tournamentsList_backbone)
			// debugger
			// console.log(this.tournamentsList)
			// for(const tournament of this.tournamentsList){
			// 	console.log(tournament.attributes)
			// }
			this.tournamentList =
			this.tournamentsList_backbone.models.map(e => e.attributes)
		},
		// template: _.template($("script[name='tmpl-tournaments-list']").html()),
		getTournaments(){
			// todo : Backbone.collection, then Helper.fetch() or Helper.ajax
			// return [{id: 1, name: 'Tournament for heroes', status: 'finished'},
			// 				{id: 2, name: 'Tournament of the century', status: 'running'}]
			return this.tournamentList
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
					location.href = `#game/tournaments/${tournament.id}`;
				})
				contentElem.html(tournament.name)
				if(tournament.status == 'finished'){
					contentElem.css('background-color','#7c7e7c')
					contentElem.css('border','#484848 5px solid')
				} else if (tournament.status == 'pending'){
					contentElem.css('background-color', '#19d81f')
					contentElem.css('border', '5px solid #008814')
				} else if (tournament.status == 'started'){
					contentElem.css('background-color', '#ff9b22')
					contentElem.css('border', '5px solid #a95d01')
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