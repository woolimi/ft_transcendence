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
				"click .promote-user": "promote_user",
				"click .demote-user": "demote_user",
			},
			initialize: async function(options) {
				try {
					this.render_page();
					const listUsers = await Helper.ajax(`/api/user_info/show_all`, '', 'GET');
					this.render_user_list({ list: listUsers });
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
			async promote_user(e){
				// try {
				// 	const id = $(e.currentTarget).data().id;
				// 	await Helper.ajax(`/api/user_info/${id}/ban`, '', 'PUT');
				// 	const listUsers = await Helper.ajax(`/api/user_info/show_all`, '', 'GET');
				// 	this.render_user_list({ list: listUsers });
				// } catch (error) {
				// 	console.error(error);
				// }
			},
			async demote_user(e){
				// try {
				// 	const id = $(e.currentTarget).data().id;
				// 	await Helper.ajax(`/api/user_info/${id}/unban`, '', 'PUT');
				// 	const listUsers = await Helper.ajax(`/api/user_info/show_all`, '', 'GET');
				// 	this.render_user_list({ list: listUsers });
				// } catch (error) {
				// 	console.error(error);
				// }
			},
		});
	})

}
export default AdminGuildRights;