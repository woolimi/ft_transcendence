import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import ChatChannel from "../channels/chat_channel"
import Helper from "./Helper"
import Profile from "./Profile"
import Channel from "./Channel"

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

		Chat.Messages = Messages;
		Chat.Content = Backbone.View.extend({
			el: $("#app"),
			page_template: _.template($("script[name='tmpl-chat-content']").html()),
			messages_template: _.template($("script[name='tmpl-chat-messages']").html()),
			members_template: _.template($("script[name='tmpl-chat-members']").html()),
			events: {
				"submit #send-message-form": "send_message",
			},
			initialize: async function (options) {
				this.options = options;
				this.render_page();
				$("#chat-content").on("scroll", this.scroll_event_callback);
				this.messages = new Messages([], options);
				this.members = new Members([], options);
				try {
					await Helper.fetch(Profile.userProfile);
					await Helper.fetch(this.messages);		
					await Helper.fetch(this.members);
					await Helper.ajax(`/api/chats/${options.room}/display`, "display=true", "PUT");
					await Helper.fetch(Channel.m_channel_list);
					Channel.channel_list.render();
					this.opponent = this.find_opponent(this.members.toJSON());
					this.block_list = Profile.userProfile.get("block_list");
					const is_blocked = _.find(this.block_list, (u) => {
						return u.user_id === this.opponent.user_id
					});

					if (is_blocked) {
						$("#chat-message-loader-wrapper").removeClass("d-none");
						$("#chat-message-loader-wrapper")
							.html("<h1>Blocked user</h1><p>To chat with this user, please remove from block list</p>");
						const form = $("#send-message-form")
						form.find("button[type='submit']").attr("disabled", true);
						const input = form.find("#message");
						input.attr("readonly", true);
						input.attr("placeholder", "");
					}
					else
						this.render_messages();
					this.scroll_down();
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
			},
			render_members() {
				$('#chat-members').html(this.members_template({
					members: this.members.toJSON(),
				}))
				$("#chat-title").html(this.opponent.nickname);
			},
			find_opponent(members) {
				if (members[0].user_id !== $('html').data().userId)
					return members[0];
				return members[1];				
			},
			scroll_down() {
				const content = document.getElementById("chat-content");
				content.scrollTop = content.scrollHeight;
			},
			send_message: async function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				const contentEl = $(e.currentTarget).find('input#message');
				const content = _.escape(contentEl.val());
				if (content === "")
					return;
				if (content.length > 300)
					return Helper.flash_message("danger", "message is too long");
				const new_msg = new Message({
					user_id: $('html').data().userId,
					content: content,
				})
				try {
					await Helper.save(new_msg);
					await Helper.fetch(this.messages)
					this.render_messages();
					this.scroll_down();
					contentEl.val("");
				} catch (error) {
					if (error.statusText)
						Helper.flash_message("danger", error.statusText);
					else
						console.error(error);
				}
			},
			recv_callback: function(data) {
				if (data.user_id == $('html').data().userId)
					return;
				data.nickname = Chat.content.opponent.nickname;
				data.avatar_url = Chat.content.opponent.avatar_url;
				const new_message = new Message(data);
				Chat.content.messages.add(new_message);
				Chat.content.render_messages();				
				Chat.content.scroll_down();
			},
			scroll_event_callback(e) {
				const t = e.currentTarget;
				if (t.scrollTop === 0) {
					const prev_messages = new Chat.Messages([], Chat.content.options);
					const id = Chat.content.messages.toJSON()[0].id;
					if (id === 1) {
						Helper.flash_message("danger", "no more messages");
						return;
					}
					Chat.content.toggle_message_loader();
					window.setTimeout(Chat.content.toggle_message_loader, 600);
					const content = document.getElementById("chat-content");
					const current_scroll_pos = content.scrollTop;
					const old_scroll = content.scrollHeight - content.clientHeight;

					prev_messages.fetch({
						data: $.param({ first_id: id }),
						success: function (collection, response, options) {
							collection.add(Chat.content.messages.models);
							Chat.content.messages = collection;
							Chat.content.render_messages();
							const new_scroll = content.scrollHeight - content.clientHeight;
							content.scrollTop = current_scroll_pos + (new_scroll - old_scroll);
						},
						error: function() {
							Helper.flash_message("danger", "Internal server error");
						}
					});
				}
			},
			toggle_message_loader() {
				$("#chat-message-loader-wrapper").toggleClass("d-none");
				$("#chat-message-loader").toggleClass("d-none");
			}
		});

	});
}

export default Chat;