import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"

const Tournament = {};

if ($('html').data().isLogin) {

$(() => {
	const TournamentModel = Backbone.Model.extend({
		urlRoot: "/api/tournaments/" 
		// Backbone.history.fragment.split("/")[1];
	});

	Tournament.Content = Backbone.View.extend({
		el: $("#view-content"),
		page_template: _.template($("script[name='tmpl-tournament-page']").html()),
		info_template: _.template($("script[name='tmpl-tournament-infos']").html()),
		tree_template: _.template($("script[name='tmpl-tournament-tree']").html()),
		match_template: _.template($("script[name='tmpl-tournament-match']").html()),
		
		model_backbone: {},
		model:{},

		initialize: async function(id){
			this.id = id
			this.model_backbone = new TournamentModel({id: id})
			await Helper.fetch(this.model_backbone)
			this.model = this.model_backbone.attributes
			this.playerNames = {}
			for(let i=0; i < 4; i++){
				if(this.model.players[i])
					this.playerNames[this.model.players[i].id] = this.model.players[i].name
			}
			this.render_page()
			this.render_infos()
			this.render_tree()
			this.render_match('#semi-final-1', this.model.semis[0])
			this.render_match('#semi-final-2', this.model.semis[1])
			this.render_match('#final', this.model.final)
		},

		render_page() {
			this.$el.html(this.page_template());
		},
		render_infos() {
			this.$el.find('#tournament-infos').html(
				this.info_template({model: this.model})
			)
		},
		render_tree() {
			this.$el.find('#tournament-tree').html(
				this.tree_template()
			)
		},
		render_match(selector, match){
			this.$el.find(selector).html(
				this.match_template({
					match: match,
					playerNames: this.playerNames
				})
			)
		}
	});
	
})

}

export default Tournament;