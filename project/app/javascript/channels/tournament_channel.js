import consumer from "./consumer"

const TournamentChannel = {};
TournamentChannel.channel = null;

if ($('html').data().isLogin) {
  $(() => {

    TournamentChannel.unsubscribe = function () {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    }

    TournamentChannel.subscribe = function (tournament_id, recv_callback, self) {
      if (this.channel)
        return;

      this.channel = consumer.subscriptions.create({
          channel: "TournamentChannel",
          tournament_id: tournament_id,
        }, {
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

export default TournamentChannel;