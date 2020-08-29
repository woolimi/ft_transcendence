import consumer from "./consumer"
import Helper from "../packs/Helper";

const NotificationChannel = {};
NotificationChannel.channel = null;

if ($('html').data().isLogin)
{
  $(() => {
    NotificationChannel.unsubscribe = function() {
      if (this.channel) {
        this.channel.unsubscribe();
        this.channel = null;
      }
    };
    NotificationChannel.subscribe = function() {
      if (this.channel)
        return;
      this.channel = consumer.subscriptions.create({
				channel: "NotificationChannel"
			}, {
        received: function(data) {
					switch(data.type){
            case "game-request":
              handle_game_request(data);
						break;
						default:
							break;
					}
				},
				// connected() {},
        // disconnected() {},
        // rejected() {}
      }); 
    }
    

    function handle_game_request(data) {
      SimpleNotification.message({
        text: data.content,
        buttons: [{
          value: 'YES', // The text inside the button
          type: 'success', // The type of the button, same as for the notifications
          onClick: (notification) => {
            // The onClick function receive the notification from which the button has been clicked
            // You can call notification.remove(), notification.close() or notification.closeFadeout()
            // if you wish to remove the notification by clicking on  the buttons
            notification.close();
          }
        },
        {
          value: 'NO', // The text inside the button
          type: 'error', // The type of the button, same as for the notifications
          onClick: (notification) => {
            // The onClick function receive the notification from which the button has been clicked
            // You can call notification.remove(), notification.close() or notification.closeFadeout()
            // if you wish to remove the notification by clicking on  the buttons
            notification.close();
          }
        }]
      }, { removeAllOnDisplay: true, closeButton: false, closeOnClick: false })
    }

  }); // window.onload
}

export default NotificationChannel;
