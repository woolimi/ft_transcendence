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
			events: {
				"click .delete-channel": "delete_channel"
			},
			async initialize() {
				try {
					this.render_page();
					const list = await Helper.ajax(`/api/channels`, '', 'GET');
					this.render_channel_list({ list: list.channels });
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
			async delete_channel(e){
				try {
					const id = $(e.currentTarget).data().id;
					await Helper.ajax(`/api/channels/${id}`, '', 'DELETE');
					const list = await Helper.ajax(`/api/channels`, '', 'GET');
					this.render_channel_list({ list: list.channels });
				} catch (error) {
					console.error(error);
				}
			}
		});
	})

}
export default Admin;