import consumer from "./consumer"
import Backbone from "backbone"
import Channel from "../Channel"
import Helper from "../Helper";

const MessageNotificationChannel = {};

if ($('html').data().isLogin)
{
  $(()=> {
    const render_badge = function(channel) {
      const badge = channel.find(".badge");
      let unread = badge.html()
      channel.removeClass("d-none");
      badge.html(++unread);
      badge.removeClass("d-none");
    }

    MessageNotificationChannel.subscribe = function() {
      consumer.subscriptions.create({
          channel: "MessageNotificationChannel", 
          user_id: $('html').data().userId
        }, {
        connected() {
          // Called when the subscription is ready for use on the server
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
        },
        async received(data) {
          // Called when there's incoming data on the websocket for this channel
          // data = { type: "chats / channels " room: "..."}

          try {
            // channel setting changed
            if (data.channel_password === "changed") {
              const cur_routes = Backbone.history.fragment.split("/")
              await Helper.fetch(Channel.m_channel_list)
              Channel.channel_list.render_channel_list();
              if (cur_routes[0] === "channels" && cur_routes[1] === data.channel_id)
                Channel.content.render_login();
              return
            }
            // invited
            if (data.member) {
              await Helper.fetch(Channel.m_channel_list)
              Channel.channel_list.render_channel_list();
              Helper.flash_message("success", `You are invited in Channel # ${data.channel_name}`)
              return;
            }
            // new message arrived when user in channel
            const cur_routes = Backbone.history.fragment.split("/")
            if (cur_routes[0] == data.type && (cur_routes[1] == data.room || cur_routes[1] == data.channel_id)) {
              if (data.type == "channels")
                await Helper.ajax(`/api/channels/${data.channel_id}/last_visited`, "", "PUT");
              else
                await Helper.ajax(`/api/chats/${data.room}/last_visited`, "", "PUT");
              return;
            }
            // new message arrived when user out of channel
            let channel
            if (data.type === "channels") {
              channel = $("#view-channels-list").find(`[data-channel-id=${data.channel_id}]`);
            } else {
              channel = $("#view-channels-list").find(`[data-room=${data.room}]`);
            }
            if (channel.length === 0) {
              await Helper.fetch(Channel.m_channel_list)
              Channel.channel_list.render_channel_list();
              render_badge(channel);
            } else {
              render_badge(channel);
            }
          } catch (error) {
            Helper.flash_message("danger", "Internal server error"); 
          }
        }
      });
    }
  })
}

export default MessageNotificationChannel;
