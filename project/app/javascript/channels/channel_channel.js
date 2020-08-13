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

    ChannelChannel.subscribe = function(room, recv_callback) {
      if (this.channel)
        return;
      this.channel = consumer.subscriptions.create({
        channel: "ChannelChannel",
        room: room
      }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("channel connected");
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("channel disconnected");
        },

        received(data) {
          // Called when there's incoming data on the websocket for this channel
        }
      });
 
    }
  });// window.onload
}