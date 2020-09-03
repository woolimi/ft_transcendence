import consumer from "./consumer"
import UserStatusChannel from "./user_status_channel"

const MatchChannel = {};
MatchChannel.channel = null;

if ($('html').data().isLogin) {
  $(() => {

    MatchChannel.unsubscribe = function() {
      if (this.channel) {
        UserStatusChannel.channel.perform("set_status", { user_id: $('html').data().userId, status: 1 });
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
        match_type: match_data.match_type,
      }, {
        async connected() {
          const m = await Helper.ajax(`/api/matches/${match_data.id}`, '', 'GET');
          me.render_players(m);
        },
        disconnected() {
        },
        received(data) {
          recv_callback.bind(me)(data);
        }
      });
    }
  });// window.onload
}

export default MatchChannel;