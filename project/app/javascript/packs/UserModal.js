import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"
import Helper from "./Helper.js";

const UserModal = {};

if ($('html').data().isLogin) {
	$(() => {
		/* View */
		const UserModalView = Backbone.View.extend({
			template: _.template($("script[name='tmpl-user-info-modal']").html()),
			el: $("#app"),
			events: {
				"click .userInfoModal": "render_user",
				"click #start-chat": "start_chat",
			},
			async render_user(e) {
				try {
					const user_id = $(e.currentTarget).data().userId;
					const user = await Helper.ajax(`/api/user_info/${user_id}`, '', 'GET');
					$('#view-user-info-modal').html(this.template({ user: user }));
				} catch (error) {
					console.error(error);
				}
			},
			start_chat(e) {
				const room = $(e.currentTarget).data().room;
				Router.router.navigate("/chats/" + room, { trigger: true });
				$('#userInfoModal').modal('toggle');
			}
		});

		UserModal.content = new UserModalView();
	})

} // if logged in

export default UserModal;