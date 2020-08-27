import consumer from "./consumer"

const ChannelChannel = {}
ChannelChannel.channel = null;

if ($('html').data().isLogin)
{
  $(() => {
    ChannelChannel.unsubscribe = function() {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    };

    ChannelChannel.subscribe = function(channel_id, recv_callback) {
      if (this.channel)
        return;
      this.channel = consumer.subscriptions.create({
        channel: "ChannelChannel",
        channel_id: channel_id
      }, {
        connected: function() {
          // Called when the subscription is ready for use on the server
          // update last_visited time
          Helper.ajax(`/api/channels/${channel_id}/last_visited`, "", "PUT")
            .catch((err) => {
              console.error(err);
            })
          // remove badge          
          const chat = $("#view-channels-list").find(`[data-channel-id=${channel_id}]`);
          const badge = chat.find(".badge");
          badge.html(0);
          badge.addClass("d-none");
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
        },

        received: async function(data) {
          // Called when there's incoming data on the websocket for this channel
          // update last_visited time
          await Helper.ajax(`/api/channels/${channel_id}/last_visited`, "", "PUT")
            .catch((err) => {
              console.error(err);
            })
          recv_callback(data);
        }
      });
 
    }
  });// window.onload
}

export default ChannelChannel;
