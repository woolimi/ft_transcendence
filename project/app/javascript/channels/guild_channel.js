import consumer from "./consumer"

const GuildChannel = {};
GuildChannel.channel = null;

if ($('html').data().isLogin) {
  $(() => {

    GuildChannel.unsubscribe = function () {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    }

    GuildChannel.subscribe = function (recv_callback, self) {
      if (this.channel)
        return;

      this.channel = consumer.subscriptions.create("GuildChannel", {
        connected() {
        },

        disconnected() {
        },

        received(data) {
          recv_callback.bind(self)(data)
        }
      });
    }
  });// window.onload
}

export default GuildChannel;