import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper";
import Router from "./Router";

const AdminGuildRights = {};

if ($('html').data().isLogin) {

	$(() => {
		AdminGuildRights.Content = Backbone.View.extend({
			// this.guild_id
			el: $("#view-content"),
			page_template: _.template($("script[name='tmpl-admin-guild-page']").html()),
			user_list_template: _.template($("script[name='tmpl-admin-guild-users']").html()),
			events: {
				"click .promote-user": "toggle_user",
				"click .demote-user": "toggle_user",
			},
			initialize: async function(options) {
				try {
					this.guild_id = options.guild_id
					this.render_page();
					const listGuilds = await Helper.ajax(`/api/guilds/anything`, '', 'GET');
					let guild = listGuilds.find((el)=>{return el.id == this.guild_id})
					this.render_user_list({ 
						members: guild.guild_members,
						officers: guild.guild_officers
					});
				} catch (error) {
					console.error(error);
				}
			},
			render_page() {
				this.$el.html(this.page_template());
			},
			render_user_list(data) {
				this.$el.find("#admin-guild-users").html(this.user_list_template(data));
			},
			async toggle_user(e){
				try {
					const id = $(e.currentTarget).data().id;
					await Helper.ajax('/api/guilds/anything' , {toggle_guild: this.guild_id, toggle_id: id}, 'PUT')
					const listGuilds = await Helper.ajax(`/api/guilds/anything`, '', 'GET');
					let guild = listGuilds.find((el)=>{return el.id == this.guild_id})
					this.render_user_list({ 
						members: guild.guild_members,
						officers: guild.guild_officers
					});
				} catch (error) {
					console.error(error);
				}
			},
		});
	})

}
export default AdminGuildRights;