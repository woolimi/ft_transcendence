import consumer from "./consumer"
import $ from "jquery"
import Backbone from "backbone"
import Friends from "../packs/Friends.js"

const UserStatusChannel = {};
UserStatusChannel.channel = null;

if ($('html').data().isLogin) {
  $(() => {

    const UserStatus =  Backbone.Model.extend({
      defaults: {
        user_id: $('html').data().userId,
        status: 1, // 0: offline, 1: online, 2: in game
      },
      urlRoot: "/api/user_status/",
      idAttribute: 'user_id',
      url: function () {
        return this.urlRoot + encodeURIComponent(this.get('user_id'));
      },
    });

    const user_status = new UserStatus();

    UserStatusChannel.subscribe = function() {
      if (this.channel)
        return;

      this.channel = consumer.subscriptions.create("UserStatusChannel", {
        connected() {
          // Called when the subscription is ready for use on the server
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          this.unsubscribe();
        },

        received(data) {
          // Called when there's incoming data on the websocket for this channel
          if (user_status.get("user_id") === data.user_id && data.status == 0) {
            user_status.save();
            return;
          }
          // check if signout user is freind
          const f = Friends.friends.findWhere({ "user_id": data.user_id });
          if (f) {
            f.set({ status: data.status });
            Friends.list.render();
          }
        },

        rejected() {
          // Called when the subscription is rejected by the server.
          this.unsubscribe();
        },
      });
    }
  });
}

export default UserStatusChannel;
