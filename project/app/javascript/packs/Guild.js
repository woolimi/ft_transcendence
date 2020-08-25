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
			'click .joinGuild': 'joinGuild',
			'click .leaveGuild': 'leaveGuild',
		},
		initialize: async function(){
			try {
			await Helper.fetch(this.model);
				await Helper.fetch(this.model);
				this.render();
			} catch (error) {
				Helper.flash_message("danger", "Error while loading guild ranks!");
			}
		},
		joinGuild: async function(e){
			console.log("Here we go!");
			const guild_data = $(e.target).data();
			Profile.userProfile.set('guild_id', guild_data.guild_id);
			console.log(Profile.userProfile.toJSON());
			await Helper.save(Profile.userProfile);
			this.render();
		},
		leaveGuild: async function(e){
			Profile.userProfile.set('guild_id', null);
			await Helper.save(Profile.userProfile);
			this.render();
		},
		render: async function () {
			await Helper.fetch(Profile.userProfile);
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