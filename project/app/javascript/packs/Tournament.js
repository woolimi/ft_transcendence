import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"

const Tournament = {};

$(() => {
	const TournamentModel = Backbone.Model.extend({
		urlRoot: "/api/tournaments/" 
		// Backbone.history.fragment.split("/")[1];
	});

	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),
		model_backbone: {},
		model:{},
		initialize: async function(id){
			this.id = id
			this.model_backbone = new TournamentModel({id: id})
			// debugger
			await Helper.fetch(this.model_backbone)
			// debugger
			this.model = this.model_backbone.attributes
			// this.playerNames = {}
			// for(let i=0; i < 4; i++){
			// 	this.playerNames[this.model.players[i].id] 
			// 		= this.model.players[i].name
			// }
			this.render()
		},

		// getPlayerName: function(id){ // todo : fetch
		// 	// let playerNames = ['', 'Tom', 'John', 'Cena', 'Max']
		// 	// debugger
		// 	return this.playerNames[id]
		// },

		getWinnerClass: function(winnerId, id){
			if(winnerId == id)
				return 'winner'
			else
				return ''
		},

		getTournament: function(){
			// todo : model and fetch it
			let tournament = {
				id: this.model.id,
				name: this.model.name,
				status: this.model.status,
				id_player_1: this.model.players[0].id,
				id_player_2: this.model.players[1].id,
				id_player_3: this.model.players[2].id,
				id_player_4: this.model.players[3].id,
				semiFinal_1: {
					match_id: this.model.semis[0].id,
					left_score: this.model.semis[0].player_one.points,
					right_score: this.model.semis[0].player_two.points,
					winner_name: this.model.semis[0].winner
				},
				semiFinal_2:{
					match_id: this.model.semis[1].id,
					left_score: this.model.semis[1].player_one.points,
					right_score: this.model.semis[1].player_two.points,
					winner_name: this.model.semis[1].winner
				},
				final:{
					match_id: this.model.final.id,
					left_score: this.model.final.player_one.points,
					right_score: this.model.final.player_two.points,
					winner_name: this.model.final.winner
				}
			}
			return tournament
		},

		// template: _.template($("script[name='tmpl-tournaments-list']").html()),
		render: function() {
			// const content = this.template();
			// todo : model, use id to get specific tournament
			let tournament = this.getTournament(); 
			let content = `<div id="tournamentBody">
			<h3>Tournament</h3><br>
			<p> <strong>Tournament name:</strong> ${tournament.name} </p>
			<p> <strong>Status:</strong> ${tournament.status}</p>
		<div id="tournamentMain">
    <ul class="round round-3">
        <li class="spacer">&nbsp;</li>
        
				<li class="gameTour game-top 
					${this.getWinnerClass(tournament.semiFinal_1.winner_id, tournament.id_player_1)}">
					${this.model.players[0].name} 
					<span>${tournament.semiFinal_1.left_score}</span>
				</li>
        <li class="gameTour game-spacer">&nbsp;</li>
				<li class="gameTour game-bottom 
					${this.getWinnerClass(tournament.semiFinal_1.winner_id, tournament.id_player_2)}">
					${this.model.players[1].name} 
					<span>${tournament.semiFinal_1.right_score}</span>
				</li>

        <li class="spacer">&nbsp;</li>
        
				<li class="gameTour game-top 
					${this.getWinnerClass(tournament.semiFinal_2.winner_id, tournament.id_player_3)}">
					${this.model.players[2].name}
					<span>${tournament.semiFinal_2.left_score}</span>
				</li>
        <li class="gameTour game-spacer">&nbsp;</li>
				<li class="gameTour game-bottom 
					${this.getWinnerClass(tournament.semiFinal_2.winner_id, tournament.id_player_4)}">
					${this.model.players[3].name}
					<span>${tournament.semiFinal_2.right_score}</span>
				</li>

        <li class="spacer">&nbsp;</li>
    </ul>
    <ul class="round round-4">
        <li class="spacer">&nbsp;</li>
        
				<li class="gameTour game-top 
					${this.getWinnerClass(tournament.final.winner_id, tournament.semiFinal_1.winner_id)}">
					${tournament.semiFinal_1.winner_name}
					<span>${tournament.final.left_score}</span>
				</li>
        <li class="gameTour game-spacer">&nbsp;</li>
				<li class="gameTour game-bottom 
					${this.getWinnerClass(tournament.final.winner_id, tournament.semiFinal_2.winner_id)}">
					${tournament.semiFinal_2.winner_name} 
					<span>${tournament.final.right_score}</span>
				</li>
        
        <li class="spacer">&nbsp;</li>
    </ul>       
</div>
</div>
			`
			this.$el.html(content);
			return this;
		}
	});
	
})

export default Tournament;