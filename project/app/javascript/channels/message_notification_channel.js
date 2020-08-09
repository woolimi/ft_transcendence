import consumer from "./consumer"
import Backbone from "backbone"
import Channel from "../packs/Channel"

const MessageNotificationChannel = {};

if ($('html').data().isLogin)
{
  $(()=> {
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
          // Router check
          const cur_routes = Backbone.history.fragment.split("/")
          if (cur_routes[0] == data.type && cur_routes[1] == data.room)
            return;
          const channel = $("#view-channels-list").find(`[data-room=${data.room}]`); 
          if (channel.length === 0)
          {
            try {
              await Helper.fetch(Channel.m_channel_list)
              Channel.channel_list.render_channel_list();
              const channel = $("#view-channels-list").find(`[data-room=${data.room}]`); 
              render_badge(channel);
            } catch (error) {
              console.error(error);
            }
          } else {
            render_badge(channel);
          }
        }
      });
    }
    function render_badge(channel) {
      const badge = channel.find(".badge");
      let unread = badge.html()
      channel.removeClass("d-none");
      badge.html(++unread);
      badge.removeClass("d-none");      
    }
  })
}

export default MessageNotificationChannel;
