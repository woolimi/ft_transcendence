import consumer from "./consumer"

const ChatChannel = {};

if ($('html').data().isLogin)
{
  $(() => {
    ChatChannel.subscribe = function(room) {
      return new Promise(function (resolve, reject) {
        consumer.subscriptions.create({
          channel: "ChatChannel",
          room: room
        }, {
          connected() {
            // Called when the subscription is ready for use on the server
            console.log("channel connected");
            resolve(true);
          },

          disconnected() {
            // Called when the subscription has been terminated by the server
            this.unsubscribe();
            console.log("channel disconnected");
            reject("disconnected by server");
          },

          received(data) {
            // Called when there's incoming data on the websocket for this channel
          },

          rejected() {
            this.unsubscribe();
            reject("rejected by server");
          }
        });        
      });
    }
  });
}

export default ChatChannel;
