import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import ChatChannel from "../channels/chat_channel.js"
import Helper from "./Helper.js"

const Chat = {};

if ($('html').data().isLogin) {
	$(() => {
		const View = Backbone.View
		Backbone.View = View.extend({
			constructor: function (options) {
				this.options = options;
				View.apply(this, arguments);
			}
		});
		
		const Message = Backbone.Model.extend({
			initialize: function (attrs) {
				this.url = function() {
					return "/api/chats/" + Backbone.history.fragment.split("/")[1] + "/chat_messages/";
				};
			},
		});

		const Messages = Backbone.Collection.extend({
			model: Message,
			initialize: function(attrs, options) {
				this.url = function () {
					return "/api/chats/" + options.room + "/chat_messages";
				};
			},
		});

		const Member = Backbone.Model.extend({
			initialize: function(attrs) {
				this.url = function() {
					return "/api/chats/" + Backbone.history.fragment.split("/")[1] + "/members/";
				};
			},
		});

		const Members = Backbone.Collection.extend({
			model: Member,
			initialize: function (attrs, options) {
				this.url = function () {
					return "/api/chats/" + options.room + "/members";
				};
			},
		});

		Chat.Content = Backbone.View.extend({
			el: $("#app"),
			page_template: _.template($("script[name='tmpl-chat-content']").html()),
			messages_template: _.template($("script[name='tmpl-chat-messages']").html()),
			members_template: _.template($("script[name='tmpl-chat-members']").html()),
			events: {
				"submit #send-message-form": "send_message",
			},
			initialize: async function (options) {
				this.render_page();
				this.messages = new Messages([], options);
				this.members = new Members([], options);
				try {
					await Helper.fetch(this.messages);		
					await Helper.fetch(this.members);
					this.render_messages();
					this.render_members();
					ChatChannel.subscribe(options.room, this.recv_callback)
				} catch (error) {
					if (error.statusText)
						Helper.flash_message("danger", error.statusText);
					else
						console.error(error);
				}
			},
			render_page() {
				$('#view-content').html(this.page_template())
			},
			render_messages() {
				$("#chat-messages").html(this.messages_template({
					messages: this.messages.toJSON(),
				}))
				const content = document.getElementById("chat-content");
				content.scrollTop = content.scrollHeight;
			},
			render_members() {
				const jmembers = this.members.toJSON();
				$('#chat-members').html(this.members_template({
					members: jmembers,
				}))
				if (jmembers[0].user_id !== $('html').data().userId)
					$("#chat-title").html(jmembers[0].nickname);
				else
					$("#chat-title").html(jmembers[1].nickname);
			},
			send_message: async function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				const contentEl = $(e.currentTarget).find('input#message');
				const content = contentEl.val();
				if (content === "")
					return;
				const new_msg = new Message({
					user_id: $('html').data().userId,
					content: content,
				})
				try {
					await Helper.save(new_msg);
					await Helper.fetch(this.messages)
					this.render_messages();
				} catch (error) {
					if (error.statusText)
						Helper.flash_message("danger", error.statusText);
					else
						console.error(error);
				}
				contentEl.val("");
			},
			recv_callback: function(data) {
				if (data.user_id == $('html').data().userId)
					return;
				const member = Chat.content.members.find((model) => {
					return model.get("user_id") == data.user_id
				});
				data.nickname = member.get("nickname");
				data.avatar_url = member.get("avatar_url");
				const new_message = new Message(data);
				Chat.content.messages.add(new_message);
				Chat.content.render_messages();				
			}
		});

	});
}

export default Chat;