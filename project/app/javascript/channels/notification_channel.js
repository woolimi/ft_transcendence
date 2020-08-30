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
            case 'tournament_canceled':
              handle_tournament_canceled(data.content);
              break;
            case 'tournament_start':
              handle_tournament_start(data.content);
              break;
            case 'tournament_created':
              handle_tournament_created(data.content)
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

    function handle_tournament_canceled(data){
      SimpleNotification.error({
        text: `The tournament "${data.name}" has been canceled (not enough participants)`
      })
    }

    function handle_tournament_start(data){
      // tournament_id: self.id,
			// tournament_name: self.name,
			// match_id: match1.id,
      // opponent_name: players[1].user_profile.name
      SimpleNotification.message({
        text: `The tournament "${data.tournament_name}" started.`
      })
      // todo: link to tournament match
    }

    function handle_tournament_created(data) {
      // tournament_id: @tournament.id,
      // tournament_name: @tournament.name
      SimpleNotification.message({
        text: `The tournament "${data.tournament_name}" has been created.`
      })
      // todo: link to tournament page
    }
  }); // window.onload
}

export default NotificationChannel;
