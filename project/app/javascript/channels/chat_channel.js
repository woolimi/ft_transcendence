import consumer from "./consumer"
import Router from "../packs/Router.js"

const ChatChannel = {};

if ($('html').data().isLogin)
{
  $(() => {
    ChatChannel.subscribe = function(op_id) {
      consumer.subscriptions.create({
        channel: "ChatChannel",
        opponent_id: op_id }, {
        connected() {
          // Called when the subscription is ready for use on the server
          console.log("connected to chat")
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
          this.unsubscribe();
        },

        received(data) {
          // Called when there's incoming data on the websocket for this channel
        },

        rejected() {
          this.unsubscribe();
        }
      });
    }
  });
}

export default ChatChannel;
