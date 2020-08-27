import consumer from "./consumer"

const MatchChannel = {};
MatchChannel.channel = null;

if ($('html').data().isLogin) {
  $(() => {

    MatchChannel.unsubscribe = function() {
      if (this.channel) {
        this.channel.unsubscribe(this.match_id);
        this.channel = null;
      }
    }

    MatchChannel.subscribe = function (match_data, recv_callback, me) {
      if (this.channel)
        return;

      this.match_data = match_data;
      this.channel = consumer.subscriptions.create({
        channel: "MatchChannel",
        match_id: match_data.id,
      }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("connected to match");
          MatchChannel.channel.send({ players: true, from: me.user_id });
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          console.log("disconnected to match");
        },

        received(data) {
          // Called when there's incoming data on the websocket for this channel
          recv_callback.bind(me)(data);
        }
      });
    }
  });// window.onload
}

export default MatchChannel;