import consumer from "./consumer"

const GameChannel = {};
GameChannel.channel = null;

if ($('html').data().isLogin) {
  $(() => {

    GameChannel.unsubscribe = function () {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    }

    GameChannel.subscribe = function (recv_callback, self) {
      if (this.channel)
        return;

      this.channel = consumer.subscriptions.create("GameChannel", {
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

export default GameChannel;