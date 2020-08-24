import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Guild = {};

$(() => {

	const AllGuilds = Backbone.Model.extend({
		urlRoot: "/api/guild/",
		idAttribute: 'user_id',
		url: function () {
			return this.urlRoot + encodeURIComponent(this.get('user_id'));
		},
	});

	Guild.allGuilds = new AllGuilds();

	const GuildContent = Backbone.View.extend({
		el: $("#view-content"),
		template: _.template($("script[name='tmpl-content-guild']").html()),
		events: {
			'click input[name="guildSelection"]': 'guildOption',
		},
		guildOption: function(event){
			var val = $(event.target).val();
			console.log(val);
			this.$('.createGuild')[val == 'create' ? 'show' : 'hide']();
            this.$('.joinGuild')[val == 'join' ? 'show' : 'hide']();
			;
		},
		render: function () {
			const content = this.template();
			this.$el.html(content);
			return this;
		}
	});

	const GuildRanking = Backbone.View.extend({
		el: $("#view-content"),
		template: _.template($("script[name='tmpl-content-guild-ranking']").html()),
		model: Guild.allGuilds,
		events: {
			'click .guildRanking': 'guildRanking',
		},
		initialize: async function(){
			try {
				await Helper.fetch(this.model);
				this.render();
			} catch (error) {
				Helper.flash_message("danger", "Error while loading guild ranks!");
			}
		},
		guildRanking: function(){
			this.render();
		},
		render: function () {
			const content = this.template({
				guilds: this.model.toJSON(),
			});
			this.$el.html(content);
			return this;
		}
	});

	Guild.content = new GuildContent();
	Guild.ranking = GuildRanking;
})

export default Guild;