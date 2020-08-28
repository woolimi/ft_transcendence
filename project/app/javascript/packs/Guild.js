import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Profile from "./Profile.js"
import Router from "./Router.js"

const Guild = {};

if ($('html').data().isLogin) {

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
			"click .joinGuild": "joinGuild",
			"click .leaveGuild": "leaveGuild",
			"submit #create-guild": "createGuild",
			"click .warHistory": "warHistory",
		},
		initialize: async function(){
			try {
				this.user_id = $('html').data().userId;
			
				await Helper.fetch(this.model);
				await Helper.fetch(Profile.userProfile);
			} 	catch (error) {
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
		createGuild: async function(e){
			e.preventDefault();
			const form = $("#create-guild");
			const guildName = $(".newGuildName").val();
			var i = 0
			var guildArr = this.model.toJSON();
			const data = form.serialize();
			for(i = 0; i < Object.keys(guildArr).length; i++)
			{
				if(guildArr[i].name == guildName)
					return Helper.flash_message("danger", "Guild already exists");
			}
			await Helper.ajax(`/api/guild/${this.user_id}`, "guildName=" + guildName, "PUT");
			await Helper.fetch(this.model);
			this.render();
			console.log($(".newGuildName").val());
		},
		warHistory: async function(e)
		{
			const guild_data = $(e.target).data();
			Router.router.navigate("/guild/war_history/" + guild_data.guild_id, {trigger: true});
		},
		render: async function () {
			await Helper.fetch(Profile.userProfile);
			var guild = this.model.toJSON();
			const content = this.template({
				guilds: guild,
				user: Profile.userProfile.toJSON(),
			});
			this.$el.html(content);
			return this;
		}
	});

	Guild.content = new GuildContent();
})

}

export default Guild;