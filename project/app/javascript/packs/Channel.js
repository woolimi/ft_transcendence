import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Router from "./Router.js"
import Profile from "./Profile"
const Channel = {};

if ($('html').data().isLogin)
{
	$(() => {
		const M_ChannelList = Backbone.Model.extend({
			defaults: {
				channels: null,
				chats: null,
			},
			url: function () {
				return "/api/channels/";
			},
		});

		const m_channel_list = new M_ChannelList();
		Channel.m_channel_list = m_channel_list;

		Channel.V_GenerateChannel = Backbone.View.extend({
			el: $("#app"),
		});

		Channel.V_ChannelList = Backbone.View.extend({
			el: $("#app"),
			channel_list_template: _.template($("script[name='tmpl-channels-list']").html()),
			channel_list: m_channel_list,
			found_channel_list_template: _.template($("script[name='tmpl-found-channel-list'").html()),
			events: {
				"click .channel-list-chat": "start_chat",
				"click .channel-list-channel": "start_channel",
				"click .remove-chat": "remove_chat",
				"submit #generate-channel-form": "generate_channel",
				"click #searchChannelModalBtn": "search_channel_modal",
				"click .joinChannelBtn": "join_to_channel",
				"click .quit-channel": "quit_channel",
			},
			initialize: async function() {
				this.user_id = $('html').data().userId;
				try {
					await Helper.fetch(this.channel_list);
					this.render();
				} catch (error) {
					if (error.statusText)
						Helper.flash_message("danger", error.statusText);
					else
						console.error(error);
				}
			},
			render_channel_list: function() {
				$("#view-channels-list").html(this.channel_list_template({
					channels: this.channel_list.toJSON().channels,
					chats: this.channel_list.toJSON().chats,
					block_list: Profile.userProfile.get("block_list")
				}))
			},
			render: function() {
				this.render_channel_list();
			},
			start_chat: function(e) {
				e.stopImmediatePropagation();
				const room = $(e.currentTarget).data().room;
				Router.router.navigate("/chats/" + room, { trigger: true });
			},
			start_channel: function(e) {
				e.stopImmediatePropagation();
				const channel_id = $(e.currentTarget).data().channelId;
				Router.router.navigate("/channels/" + channel_id, { trigger: true });
			},
			remove_chat: function(e) {
				e.stopImmediatePropagation();
				const target = $(e.currentTarget).parent().parent();
				target.addClass("d-none");
				// ajax call update display
				const room = target.data().room;
				Helper.ajax(`/api/channels/${room}/display`, "display=false", "PUT")
					.catch((err) => {
						console.error(err);
					})
			},
			generate_channel: async function(e) {
				e.preventDefault();
				const data = $("#generate-channel-form").serializeArray();
				data[0].value = _.escape(data[0].value);
				if (!data[0].value)
					return Helper.flash_message("danger", "Please type channel name");
				if (data[0].value.length < 3)
					return Helper.flash_message("danger", "Channel name has to be more than 4 letters");
				if (data[0].value.length > 20)
					return Helper.flash_message("danger", "Channel name has to be less than 20 letters");
				if (data[2].value > 0 && data[2].value.length < 6)
					return Helper.flash_message("danger", "Password has to be more than 5 letters");
				if (data[2].value.length > 30)
					return Helper.flash_message("danger", "Password is too long");
				if (data[2].value !== data[3].value)
					return Helper.flash_message("danger", "Passwords are not same")

				const seralized_data = $("#generate-channel-form").serialize();
				try {
					await Helper.ajax(`/api/channels`, seralized_data, "POST");
					Helper.flash_message("success", "successfully created a channel")
					$('#generateChannelModal').modal('hide');

				} catch (error) {
					Helper.flash_message("danger", error.responseText)
				}
			},
			search_channel_modal: async function(e) {
				e.preventDefault();
				try {
					const public_channels = await Helper.ajax('/api/channels/?search=public', "", "GET");
					$("#found-channel-list").html(this.found_channel_list_template({ public_channels: public_channels }));
					$('#searchChannelModal').modal('show');
				} catch (error) {
					Helper.flash_message("danger", error.responseText)
				}
			},
			join_to_channel: async function(e) {
				e.stopImmediatePropagation();
				const channel_id = $(e.currentTarget).data().channelId;
				// 해당 유저를 멤버에 등록
				try {
					await Helper.ajax(`/api/channels/${channel_id}/members/${this.user_id}`, "", "PUT")
					await Helper.fetch(this.channel_list);
					this.render_channel_list();
					$(e.currentTarget).attr("disabled", true);
					Helper.flash_message("success", "Successfully joined to channel")

				} catch (error) {
					Helper.flash_message("danger", error.responseText)
				}
			},
			quit_channel: async function(e) {
				e.stopImmediatePropagation();
				const data = $(e.currentTarget).data();
				if (!confirm(`Do you want to quit "${data.room}" channel?`))
					return;
				try {
					await Helper.ajax(`/api/channels/${data.channelId}/members/${this.user_id}`, "", "DELETE")
					Helper.flash_message("success", "Successfully quit channel")
					await Helper.fetch(this.channel_list);
					this.render_channel_list();
					// if user is in channel, redirect
					const url = Backbone.history.fragment.split("/");
					if (url[0] === "channels" && url[1] === data.channelId)
						window.location.hash = "";				
				} catch (error) {
					Helper.flash_message("danger", error.responseText)
				}
			}
		});

		const Message = Backbone.Model.extend({
			initialize: function (attrs) {
				this.url = function () {
					return "/api/channels/" + Backbone.history.fragment.split("/")[1] + "/channel_messages/";
				};
			},
		});

		const Messages = Backbone.Collection.extend({
			model: Message,
			initialize: function (attrs, options) {
				this.url = function () {
					return "/api/channels/" + options.channel_id + "/channel_messages";
				};
			},
		});

		const Member = Backbone.Model.extend({
			initialize: function (attrs) {
				this.url = function () {
					return "/api/channels/" + Backbone.history.fragment.split("/")[1] + "/members/";
				};
			},
		});

		const Members = Backbone.Collection.extend({
			model: Member,
			initialize: function (attrs, options) {
				this.url = function () {
					return "/api/channels/" + options.channel_id + "/members";
				};
			},
		});

		Channel.Content = Backbone.View.extend({
			el: $("#app"),
			page_template: _.template($("script[name='tmpl-channel-content']").html()),
			messages_template: _.template($("script[name='tmpl-channel-messages']").html()),
			members_template: _.template($("script[name='tmpl-channel-members']").html()),
			events: {
				"submit #send-message-form": "send_message",
			},
			initialize: async function (options) {
				this.options = options;
				this.messages = new Messages([], options);
				this.members = new Members([], options);
				this.user_id = $('html').data().userId;
				try {
					const info = await Helper.ajax(`/api/channels/${options.channel_id}`, "", "GET")
					await Helper.fetch(this.members);
					if (!Helper.contain(this.members, (m) => m.get("user_id") === this.user_id)) {
						window.location.hash = "";
						throw new Error("You are not a member of this channel");
					}
					await Helper.fetch(this.messages);
					this.render_page();
					this.render_messages();
					this.render_members(info);
				}
				catch (error) {
					if (error.statusText)
						Helper.flash_message("danger", error.statusText);
					else
						Helper.flash_message("danger", error);
				}
			},
			render_page() {
				$("#view-content").html(this.page_template());
			},
			render_messages() {
				$("#chat-messages").html(this.messages_template({
					messages: this.messages.toJSON(),
				}))
			},
			render_members(info) {
				$('#chat-members').html(this.members_template({
					members: this.members.toJSON(),
				}))
				$("#chat-title").html(info.room);
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
					user_id: this.user_id,
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
		}); 
	}); // window.onload
}

export default Channel;