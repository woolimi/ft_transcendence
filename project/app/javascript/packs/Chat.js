import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Router from "./Router.js"

const Chat = {};

if ($('html').data().isLogin) {
	$(() => {
		const Content = Backbone.View.extend({
			el: $("#app"),
			template: _.template($("script[name='tmpl-content-chat']").html()),
			events: {
				"click .btnChat": "start_chat"
			},
			start_chat: function(e) {
				const user_id = $(e.currentTarget).data().userId;
				if (user_id !== $('html').data().userId)
					Router.router.navigate("/chat/" + user_id, { trigger: true });
				$('#userInfoModal').modal('toggle');
			},
			render: function(user_id) {
				const opponent = { user_id: user_id };
				this.$el.find('#view-content').html(this.template({
					opponent: opponent
				}))
			},
		})
		Chat.content = new Content();
	});
}

export default Chat;