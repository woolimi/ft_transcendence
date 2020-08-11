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
			events: {
				"click .channel-list-chat": "start_chat",
				"click .remove-chat": "remove_chat",
				"submit #generate-channel-form": "generate_channel",
			},
			initialize: async function() {
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
		});

		Channel.Content = Backbone.View.extend({
			el: $("#app"),
			page_template: _.template($("script[name='tmpl-channel-content']").html()),
			events: {
			},
			initialize: async function (options) {
				this.render_page();
				console.log("channel page")
			},
			render_page() {
				$("#view-content").html(this.page_template());
			},
		}); 
	}); // window.onload
}

export default Channel;