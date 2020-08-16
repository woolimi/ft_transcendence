import consumer from "./consumer"
import Helper from "../packs/Helper";

const ChatChannel = {};
ChatChannel.channel = null;

if ($('html').data().isLogin)
{
  $(() => {
    ChatChannel.unsubscribe = function() {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    };
    ChatChannel.subscribe = function(room, recv_callback) {
      if (this.channel)
        return;
      this.channel = consumer.subscriptions.create({
        channel: "ChatChannel",
        room: room
      }, {
        connected() {
          // Called when the subscription is ready for use on the server
          // update last_visited time
          Helper.ajax(`/api/chats/${room}/last_visited`, "", "PUT")
            .catch((err)=> {
              console.error(err);
            })
          // remove badge          
          const chat = $("#view-channels-list").find(`[data-room=${room}]`);
          const badge = chat.find(".badge");
          badge.html(0);
          badge.addClass("d-none");
        },

        disconnected() {
          // Called when the subscription has been terminated by the server
        },

        received: async function(data) {
          // Called when there's incoming data on the websocket for this channel

          // update last_visited time
          await Helper.ajax(`/api/chats/${room}/last_visited`, "", "PUT")
            .catch((err) => {
              console.error(err);
            })
          recv_callback(data);
        },
        rejected() {
        }
      }); 
    }
    
  }); // window.onload
}

export default ChatChannel;
