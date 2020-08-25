import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Profile from "./Profile.js"

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
		model: Guild.allGuilds,
		events: {
			'click input[name="guildSelection"]': 'guildOption',
		},
		initialize: async function(){
			try {
				await Helper.fetch(this.model);
				await Helper.fetch(Profile.userProfile);
				this.render();
			} catch (error) {
				Helper.flash_message("danger", "Error while loading guild ranks!");
			}
		},
		guildOption: function(event){
			var val = $(event.target).val();
			console.log(val);
			this.$('.createGuild')[val == 'create' ? 'show' : 'hide']();
            this.$('.joinGuild')[val == 'join' ? 'show' : 'hide']();
			;
		},
		render: function () {
			const content = this.template({
				guilds: this.model.toJSON(),
				user: Profile.userProfile.toJSON(),
			});
			this.$el.html(content);
			return this;
		}
	});

	Guild.content = new GuildContent();
})

export default Guild;