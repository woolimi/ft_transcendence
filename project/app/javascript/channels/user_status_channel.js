import consumer from "./consumer"
import $ from "jquery"
import Backbone from "backbone"
import Friends from "../packs/Friends.js"

if ($('html').data().isLogin)
{
  $(() => {
    const UserStatus =  Backbone.Model.extend({
      defaults: {
        user_id: $('html').data().userId,
        status: 0, // 0: offline, 1: online, 2: in game
      },
      urlRoot: "/api/user_status/",
      idAttribute: 'user_id',
      url: function () {
        return this.urlRoot + encodeURIComponent(this.get('user_id'));
      },
      initialize: function () {
        this.fetch();
        if (this.get('status') === 0) {
          this.set({ status: 1 });
          this.save();
        } else {
          // session 허가 안함
        }
      },
    });

    let user_status;

    consumer.subscriptions.create("UserStatusChannel", {
      connected() {
        // Called when the subscription is ready for use on the server
        user_status = new UserStatus();
        console.log("user connected")
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
        user_status.set({ status: 0 });
        user_status.save();
        console.log("disconnected by server");
      },

      received(data) {
        // Called when there's incoming data on the websocket for this channel
        console.log("new user logged in ", data)
      },

      rejected() {
        // Called when the subscription is rejected by the server.
        console.log("connection refused")
      },
    });

  });
}
