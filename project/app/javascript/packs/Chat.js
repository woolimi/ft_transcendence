import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"
import ChatChannel from "../channels/chat_channel.js"

const Chat = {};

if ($('html').data().isLogin) {
	$(() => {
		const Message = Backbone.Model.extend({
			defaults: {
				chat_message_id: "undefined",
				written_by: "undefined",
				content: "undefined",
				timestamps: 0,
			},
			idAttribute: "chat_message_id",
		});

		const Messages = Backbone.Collection.extend({
			model: Message,
			url: function () {
				return "/api/chat/" + this.options.room + "/messages/";
			},
		});

		const Content = Backbone.View.extend({
			el: $("#app"),
			collection: new Messages(),
			template: _.template($("script[name='tmpl-content-chat']").html()),
			events: {
				"click .btnChat": "start_chat",
				"submit #send-message-form": "send_message"
			},
			start_chat: function(e) {
				const opponent_id = $(e.currentTarget).data().userId;
				if (opponent_id !== $('html').data().userId)
					Router.router.navigate("/chat/" + opponent_id, { trigger: true });
				$('#userInfoModal').modal('toggle');

			},
			send_message: function(e) {
				e.preventDefault();
				const msg = $(e.currentTarget).find('input#message');
				msg.val("");
			},
			render: function (op_id) {
				const opponent = { user_id: op_id };
				this.$el.find('#view-content').html(this.template({
					opponent: opponent
				}))
				ChatChannel.subscribe(op_id);
			},
		})
		Chat.content = new Content();
	});
}

export default Chat;