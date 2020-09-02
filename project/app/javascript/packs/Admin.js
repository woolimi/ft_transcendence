import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper";
import Router from "./Router";

const Admin = {};

if ($('html').data().isLogin) {

	$(() => {
		Admin.Content = Backbone.View.extend({
			el: $("#view-content"),
			page_template: _.template($("script[name='tmpl-admin-page']").html()),
			channel_list_template: _.template($("script[name='tmpl-admin-channel-list']").html()),
			user_list_template: _.template($("script[name='tmpl-admin-ban-users']").html()),
			events: {
				"click .delete-channel": "delete_channel",
				"click .ban-user": "ban_user",
				"click .unban-user": "unban_user",
			},
			async initialize() {
				try {
					this.render_page();
					const list = await Helper.ajax(`/api/channels/show_all`, '', 'GET');
					this.render_channel_list({ list: list });
					const listUsers = await Helper.ajax(`/api/user_info/show_all`, '', 'GET');
					this.render_user_list({ list: listUsers });
				} catch (error) {
					console.error(error);
				}
			},
			render_page() {
				this.$el.html(this.page_template());
			},
			render_channel_list(data) {
				this.$el.find("#admin-channel-list").html(this.channel_list_template(data));
			},
			render_user_list(data) {
				this.$el.find("#admin-ban-users").html(this.user_list_template(data));
			},
			async delete_channel(e){
				if (confirm("Are you sure?")) {
					try {
						const id = $(e.currentTarget).data().id;
						await Helper.ajax(`/api/channels/${id}`, '', 'DELETE');
						const list = await Helper.ajax(`/api/channels/show_all`, '', 'GET');
						this.render_channel_list({ list: list });
					} catch (error) {
						console.error(error);
					}
				} else {
					console.log('operation canceled')
				}
			},
			async ban_user(e){
				try {
					const id = $(e.currentTarget).data().id;
					await Helper.ajax(`/api/user_info/${id}/ban`, '', 'PUT');
					const listUsers = await Helper.ajax(`/api/user_info/show_all`, '', 'GET');
					this.render_user_list({ list: listUsers });
				} catch (error) {
					console.error(error);
				}
			},
			async unban_user(e){
				try {
					const id = $(e.currentTarget).data().id;
					await Helper.ajax(`/api/user_info/${id}/unban`, '', 'PUT');
					const listUsers = await Helper.ajax(`/api/user_info/show_all`, '', 'GET');
					this.render_user_list({ list: listUsers });
				} catch (error) {
					console.error(error);
				}
			},
		});
	})

}
export default Admin;