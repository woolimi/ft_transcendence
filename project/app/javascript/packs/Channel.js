import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Router from "./Router.js"
import Profile from "./Profile"
import ChannelChannel from "../channels/channel_channel"

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
				Helper.ajax(`/api/chats/${room}/display`, "display=false", "PUT")
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
				if (data[2].value.length > 20)
					return Helper.flash_message("danger", "Password is too long");
				if (data[2].value !== data[3].value)
					return Helper.flash_message("danger", "Passwords are not same")

				const seralized_data = $("#generate-channel-form").serialize();
				try {
					await Helper.ajax(`/api/channels`, seralized_data, "POST");
					await Helper.fetch(this.channel_list);
					this.render_channel_list();
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
					return "/api/channels/" + options.channel_id + "/members/";
				};
			},
		});

		Channel.get_info_and_render_members = async function() {
			const info = await Helper.ajax(`/api/channels/${Channel.content.options.channel_id}`, "", "GET")
			await Helper.fetch(Channel.content.members);
			info.is_owner = Channel.content.user_id === info.owner;
			info.is_admin = Helper.contain(info.admins, (m) => m === Channel.content.user_id);
			info.channel_id = info.id;
			info.members = Channel.content.members.toJSON();
			Channel.content.render_members(info);
		}

		Channel.Messages = Messages;
		Channel.Content = Backbone.View.extend({
			el: $("#app"),
			page_template: _.template($("script[name='tmpl-channel-content']").html()),
			messages_template: _.template($("script[name='tmpl-channel-messages']").html()),
			members_template: _.template($("script[name='tmpl-channel-members']").html()),
			invite_template: _.template($("script[name='tmpl-channel-invite-list']").html()),
			setting_template: _.template($("script[name='tmpl-channel-setting']").html()),
			login_template: _.template($("script[name='tmpl-channel-login']").html()),
			events: {
				"submit #send-message-form": "send_message",
				"click .mute-member-btn": "mute_unmute_member",
				"click .ban-member-btn": "ban_unban_member",
				"click .admin-member-btn": "admin_unadmin_member",
				"submit #invite-user-form": "search_for_inviting_user",
				"click .channelInviteBtn": "channel_invite_user",
				"submit #channel-setting-form": "change_channel_setting",
				"submit #channel-login-form": "channel_login",
			},
			initialize: async function (options) {
				this.options = options;
				this.messages = new Messages([], options);
				this.members = new Members([], options);
				this.user_id = $('html').data().userId;
				try {
					const info = await Helper.ajax(`/api/channels/${options.channel_id}`, "", "GET")
					await Helper.fetch(this.members);
					if (Helper.contain(info.bans, (b) => b === this.user_id))
						throw new Error("You are not allowed");
					if (!Helper.contain(this.members, (m) => m.get("user_id") === this.user_id))
						throw new Error("You are not a member of this channel");
					info.is_owner = this.user_id === info.owner;
					info.is_admin = Helper.contain(info.admins, (m) => m === this.user_id);
					info.channel_id = info.id;
					info.members = this.members.toJSON();
					await Helper.fetch(this.messages);
					this.render_page(info);
					this.render_messages();
					this.render_members(info);
					this.scroll_down();
					$("#chat-content").on("scroll", this.scroll_event_callback);
					ChannelChannel.subscribe(options.channel_id, this.recv_callback);
					this.render_channel_setting(info);
				}
				catch (error) {
					if (error.status === 401)
						this.render_login();
					if (error.responseText)
						Helper.flash_message("danger", error.responseText);
					else {
						Helper.flash_message("danger", error);
					}
				}
			},
			render_login() {
				$("#view-content").html(this.login_template());
			},
			channel_login: async function(e) {
				e.preventDefault();
				const data = $("#channel-login-form").serialize();
				try {
					await Helper.ajax(`/api/channels/${this.options.channel_id}/password`, data, "POST");
					this.initialize(this.options);				
				} catch (error) {
					if (error.responseText)
						Helper.flash_message("danger", error.responseText);
					else
						Helper.flash_message("danger", error);
				}
			},
			change_channel_setting: async function(e) {
				e.stopImmediatePropagation();
				e.preventDefault();
				const form = $("#channel-setting-form");
				const data = form.serializeArray();
				if (data.length) {
					if (data[1].value.length < 6)
					return Helper.flash_message("danger", "Password has to be more than 5 letters");
					if (data[1].value.length > 20)
					return Helper.flash_message("danger", "Password is too long");
					if (data[1].value !== data[2].value)
					return Helper.flash_message("danger", "Passwords are not same")
				}
				try {
					const sdata = form.serialize();
					await Helper.ajax(
						`api/channels/${this.options.channel_id}/password`, sdata, (sdata ? "PUT" : "DELETE")
					);
					Helper.flash_message("success", "Successfully changed channel setting");
					$("#channelPasswordModal").modal('hide');
					// render channel list
					await Helper.fetch(Channel.channel_list.channel_list);
					Channel.channel_list.render_channel_list();
				} catch (error) {
					if (error.statusText)
						Helper.flash_message("danger", error.statusText);
					else
						Helper.flash_message("danger", error);
					window.location.hash = "";			
				}
			},
			render_channel_setting: function(info) {
				$("#channel-setting-form").html(this.setting_template(info));
				$("#channel-password-on").change((e) => {
					const checked = $(e.currentTarget).prop('checked');
					const pw = $("#channel-password");
					const rpw = $("#re-channel-password")
					if (checked) {
						pw.attr("disabled", false);
						pw.attr("placeholder", "password");
						rpw.attr("disabled", false);
						rpw.attr("placeholder", "verify password");
					} else {
						pw.attr("disabled", true);
						pw.attr("placeholder", "disabled");
						pw.val("");
						rpw.attr("disabled", true);
						rpw.attr("placeholder", "disabled");
						rpw.val("");
					}
				})
			},
			search_for_inviting_user: async function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				const name = $("#invite-user-form").serializeArray()[0].value;
				try {
					const searched = await Helper.ajax(`api/user_info/?search=${name}`, "", "GET");
					$("#channel-invite-list").html(this.invite_template({
						members: this.members.toJSON(),
						searched: searched,
					}));
				} catch (error) {
					if (error.responseText)
						Helper.flash_message("danger", error.responseText);
					else {
						Helper.flash_message("danger", error);
					}
				}
			},
			channel_invite_user: async function(e) {
				e.stopImmediatePropagation();
				const user_id = $(e.currentTarget).data().userId;
				try {
					await Helper.ajax(`api/channels/${this.options.channel_id}/members/${user_id}`, "", "PUT");
					await Channel.get_info_and_render_members();
					$(e.currentTarget).attr("disabled", true);
				} catch (error) {
					if (error.responseText)
						Helper.flash_message("danger", error.responseText);
					else
						Helper.flash_message("danger", error);		
				}
			},
			recv_callback: async function (data) {
				try {
					if (data.message) {
						if (data.message.user_id == $('html').data().userId)
							return;
						await Helper.fetch(Channel.content.messages);
						Channel.content.render_messages();
						Channel.content.scroll_down();
					} else if (data.member) {
						if (data.member === $('html').data().userId)
							return;
						await Channel.get_info_and_render_members();
					} else if (data.ban) {
						if (data.ban === $('html').data().userId) {
							Helper.flash_message("danger", "You are banned");
							window.location.hash = "";
							return;
						}
						await Channel.get_info_and_render_members();
					} else if (data.admin) {
						await Channel.get_info_and_render_members();
					} else if (data.mute) {
						await Channel.get_info_and_render_members();
					}
				} catch (error) {
					if (error.status === 401)
						return Channel.content.render_login();
					if (error.responseText)
						Helper.flash_message("danger", error.responseText);
					else
						Helper.flash_message("danger", error);
					window.location.hash = "";
				}
			},
			render_page(info) {
				$("#view-content").html(this.page_template(info));
			},
			render_messages() {
				$("#chat-messages").html(this.messages_template({
					messages: this.messages.toJSON(),
				}))
			},
			render_members(info) {
				$('#chat-members-list').html(this.members_template(info))
				$("#chat-title").html(info.room);
			},
			send_message: async function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				try {
					const info = await Helper.ajax(`/api/channels/${this.options.channel_id}`, "", "GET")
					const m = _.find(info.mutes, (m) => m.user_id === this.user_id)
					if (m)
						return Helper.flash_message("danger", `You can type message after ${new Date(m.timestamp).toLocaleString()}`);

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
			channel_setting: async function(e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				console.log("channel_setting");
			},
			ban_unban_member: async function(e) {
				e.stopImmediatePropagation();
				const data = $(e.currentTarget).data();
				try {
					if ($(e.currentTarget).hasClass("ban-member") && confirm(`Do you want to undo ban ${data.nickname}?`)) {
						await Helper.ajax(`/api/channels/${this.options.channel_id}/bans/${data.userId}`, "", "DELETE");
					} else if (!$(e.currentTarget).hasClass("ban-member") && confirm(`Do you want to ban ${data.nickname}?`)){
						await Helper.ajax(`/api/channels/${this.options.channel_id}/bans/${data.userId}`, "", "PUT");
					} else
						return
					$(e.currentTarget).toggleClass("ban-member");
				} catch (error) {
					Helper.flash_message("danger", error.responseText);
				}
			},
			mute_unmute_member: async function(e) {
				e.stopImmediatePropagation();
				const data = $(e.currentTarget).data();
				try {
					if ($(e.currentTarget).hasClass("mute-member") && confirm(`Do you want to unmute ${data.nickname}?`)) {
						await Helper.ajax(`/api/channels/${this.options.channel_id}/mutes/${data.userId}`, "", "DELETE");
					} else if (!$(e.currentTarget).hasClass("mute-member") && confirm(`Do you want to mute ${data.nickname}?`)) {
						await Helper.ajax(`/api/channels/${this.options.channel_id}/mutes/${data.userId}`, "", "PUT");
					} else
						return
					$(e.currentTarget).toggleClass("mute-member");
				} catch (error) {
					Helper.flash_message("danger", error.responseText);
				}
			},
			admin_unadmin_member: async function(e) {
				e.stopImmediatePropagation();
				const data = $(e.currentTarget).data();
				try {
					if ($(e.currentTarget).hasClass("admin-member") && confirm(`Do you want to undo admin ${data.nickname}?`)) {
						await Helper.ajax(`/api/channels/${this.options.channel_id}/admins/${data.userId}`, "", "DELETE");
					} else if (!$(e.currentTarget).hasClass("ban-member") && confirm(`Do you want to designate admin ${data.nickname}?`)) {
						await Helper.ajax(`/api/channels/${this.options.channel_id}/admins/${data.userId}`, "", "PUT");
					} else
						return
					$(e.currentTarget).toggleClass("admin-member");
				} catch (error) {
					Helper.flash_message("danger", error.responseText);
				}
			},
			scroll_down() {
				const content = document.getElementById("chat-content");
				content.scrollTop = content.scrollHeight;
			},
			scroll_event_callback(e) {
				const t = e.currentTarget;
				if (t.scrollTop === 0) {
					const prev_messages = new Channel.Messages([], Channel.content.options);
					const id = Channel.content.messages.toJSON()[0].id;
					if (id === 1) {
						Helper.flash_message("danger", "no more messages");
						return;
					}
					Channel.content.toggle_message_loader();
					window.setTimeout(Channel.content.toggle_message_loader, 600);
					const content = document.getElementById("chat-content");
					const current_scroll_pos = content.scrollTop;
					const old_scroll = content.scrollHeight - content.clientHeight;

					prev_messages.fetch({
						data: $.param({ first_id: id }),
						success: function (collection, response, options) {
							collection.add(Channel.content.messages.models);
							Channel.content.messages = collection;
							Channel.content.render_messages();
							const new_scroll = content.scrollHeight - content.clientHeight;
							content.scrollTop = current_scroll_pos + (new_scroll - old_scroll);
						},
						error: function () {
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
	}); // window.onload
}

export default Channel;