import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"

const Tournament = {};

$(() => {

	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),

		initialize: function(id){
			this.id = id
			this.render()
		},

		getPlayerName: function(id){ // todo : fetch
			let playerNames = ['', 'Tom', 'John', 'Cena', 'Max']
			return playerNames[id]
		},

		getWinnerClass: function(winnerId, id){
			if(winnerId == id)
				return 'winner'
			else
				return ''
		},

		getTournament: function(id){
			// todo : model and fetch it
			let tournamentList = [
				{},
				{
					id: 1,
					name: 'Tournament for heroes',
					status: 'finished',
					id_player_1: 1,
					id_player_2: 2,
					id_player_3: 3,
					id_player_4: 4,
					semiFinal_1: {
						match_id: 123,
						left_score: 10,
						right_score: 8,
						winner_id: 1
					},
					semiFinal_2:{
						match_id: 345,
						left_score: 10,
						right_score: 8,
						winner_id: 3
					},
					final:{
						match_id: 789,
						left_score: 10,
						right_score: 8,
						winner_id: 1
					}
				},
				{
					id: 2,
					name: 'Tournament of the century',
					status: 'running',
					id_player_1: 3,
					id_player_2: 2,
					id_player_3: 1,
					id_player_4: 4,
					semiFinal_1: {
						match_id: 929,
						left_score: 10,
						right_score: 8,
						winner_id: 3
					},
					semiFinal_2:{
						match_id: NaN,
						left_score: NaN,
						right_score: NaN,
						winner_id: NaN
					},
					final:{
						match_id: NaN,
						left_score: NaN,
						right_score: NaN,
						winner_id: NaN
					}
				},
			]
			return tournamentList[id]
		},

		// template: _.template($("script[name='tmpl-tournaments-list']").html()),
		render: function() {
			// const content = this.template();
			// todo : model, use id to get specific tournament
			let tournament = this.getTournament(this.id); 
			let content = `<div id="tournamentBody">
			<h3>Tournament</h3><br>
			<p> <strong>Tournament name:</strong> ${tournament.name} </p>
			<p> <strong>Status:</strong> ${tournament.status}</p>
		<div id="tournamentMain">
    <ul class="round round-3">
        <li class="spacer">&nbsp;</li>
        
				<li class="gameTour game-top 
					${this.getWinnerClass(tournament.semiFinal_1.winner_id, tournament.id_player_1)}">
					${this.getPlayerName(tournament.id_player_1)} 
					<span>${tournament.semiFinal_1.left_score}</span>
				</li>
        <li class="gameTour game-spacer">&nbsp;</li>
				<li class="gameTour game-bottom 
					${this.getWinnerClass(tournament.semiFinal_1.winner_id, tournament.id_player_2)}">
					${this.getPlayerName(tournament.id_player_2)} 
					<span>${tournament.semiFinal_1.right_score}</span>
				</li>

        <li class="spacer">&nbsp;</li>
        
				<li class="gameTour game-top 
					${this.getWinnerClass(tournament.semiFinal_2.winner_id, tournament.id_player_3)}">
					${this.getPlayerName(tournament.id_player_3)}
					<span>${tournament.semiFinal_2.left_score}</span>
				</li>
        <li class="gameTour game-spacer">&nbsp;</li>
				<li class="gameTour game-bottom 
					${this.getWinnerClass(tournament.semiFinal_2.winner_id, tournament.id_player_4)}">
					${this.getPlayerName(tournament.id_player_4)}
					<span>${tournament.semiFinal_2.right_score}</span>
				</li>

        <li class="spacer">&nbsp;</li>
    </ul>
    <ul class="round round-4">
        <li class="spacer">&nbsp;</li>
        
				<li class="gameTour game-top 
					${this.getWinnerClass(tournament.final.winner_id, tournament.semiFinal_1.winner_id)}">
					${this.getPlayerName(tournament.semiFinal_1.winner_id)}
					<span>${tournament.final.left_score}</span>
				</li>
        <li class="gameTour game-spacer">&nbsp;</li>
				<li class="gameTour game-bottom 
					${this.getWinnerClass(tournament.final.winner_id, tournament.semiFinal_2.winner_id)}">
					${this.getPlayerName(tournament.semiFinal_2.winner_id)} 
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