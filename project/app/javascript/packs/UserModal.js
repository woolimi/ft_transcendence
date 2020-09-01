import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"
import Helper from "./Helper.js";
import NotificationChannel from "../channels/notification_channel.js";

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
				"click #ask-game": "ask_game"
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
				$('#userInfoModal').modal('hide');
			},
			async ask_game(e) {
				// check if user is login and not in game
				const opponent_id = $(e.currentTarget).data().opponent;
				const opponent = await Helper.ajax(`/api/user_status/${opponent_id}`);
				const me = await Helper.ajax(`/api/user_info/${$('html').data().userId}`, '', 'GET')
				if (me.status === 2)
					return Helper.flash_message("danger", "Cannot send duel request during game");
				if (opponent.status === 0)
					return Helper.flash_message("danger", "User is not logged in");
				if (opponent.status === 2)
					return Helper.flash_message("danger", "User is in game");
				// send notification to user
				NotificationChannel.channel.perform("send_notification", {
					user_id: opponent_id,
					type: "duel-request",
					content: `Let's play a game with ${me.nickname} !`,
					from: $('html').data().userId,
				})
			}
		});

		UserModal.content = new UserModalView();
	})

} // if logged in

export default UserModal;