import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper.js"
import Router from "./Router.js"

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
		
		Channel.V_ChannelList = Backbone.View.extend({
			el: $("#app"),
			channel_list_template: _.template($("script[name='tmpl-channels-list']").html()),
			channel_list: m_channel_list,
			events: {
				"click .channel-list-chat": "start_chat",
				"click .remove-chat": "remove_chat"
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
					// channels: this.m_channel_list.channels,
					chats: this.channel_list.toJSON().chats,
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
						console.log(err);
					})
			},
		});

	});
}

export default Channel;