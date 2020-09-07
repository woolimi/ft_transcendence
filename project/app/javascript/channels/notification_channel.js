import consumer from "./consumer"
import Helper from "../packs/Helper";
import Router from "../packs/Router";

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
            case 'tournament_canceled':
              handle_tournament_canceled(data.content);
              break;
            case 'tournament_start':
              handle_tournament_start(data.content);
              break;
            case 'tournament_created':
              handle_tournament_created(data.content);
              break;
            case "duel-request":
              handle_duel_request(data);
              break;
            case "duel-accept":
              handle_duel_accept(data);
  						break;
            case "duel-reject":
              handle_duel_reject();
              break;
            case "banned":
              handle_banned();
              break;
            case "unbanned":
              handle_unbanned();
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

    async function handle_banned(){
      NotificationChannel.unsubscribe()
      Helper.flash_message('danger', 'Your have been banned');
      await Helper.ajax('/users/sign_out', '', 'DELETE')
      window.location.href = ''
    }

    function handle_unbanned(){
      Helper.flash_message('success', 'Your have been unbanned');
    }

    function handle_duel_reject() {
      Helper.flash_message('danger', 'Your request is rejected');
    }

    function handle_duel_accept(data) {
      $('#userInfoModal').modal('hide');
      Helper.flash_message('success', 'Your request is accepted')
      return Router.router.navigate(`/game/duel/${data.from}`, { trigger: true });
    }

    function handle_duel_request(data) {
      SimpleNotification.message({
        text: data.content,
        buttons: [{
          value: 'YES', // The text inside the button
          type: 'success', // The type of the button, same as for the notifications
          async onClick(notification) {
            const status = await Helper.ajax(`/api/user_status/${data.from}`, '', "GET");
            if (status === 0)
              return Helper.flash_message("danger", "User is not logged in");
            else if (status === 2)
              return Helper.flash_message("danger", "User is in game");
            const new_match = await Helper.ajax('/api/matches/',
              `match_type=duel_friend&player_1=${data.from}&player_2=${$('html').data().userId}`, 'POST');
            NotificationChannel.channel.perform("send_notification", {
              user_id: data.from,
              type: "duel-accept",
              from: new_match.id,
            })            
            notification.close();
            return Router.router.navigate(`/game/duel/${new_match.id}`, { trigger: true });
          }
        }, {
          value: 'NO', // The text inside the button
          type: 'error', // The type of the button, same as for the notifications
          onClick: (notification) => {
            NotificationChannel.channel.perform("send_notification", { user_id: data.from, type: "duel-reject" })            
            notification.close();
          }
        }]
      }, { // options
        duration: 10000, 
        removeAllOnDisplay: true, 
        closeButton: false, 
        closeOnClick: false,
        events: {
          onDeath(notification) {
            NotificationChannel.channel.perform("send_notification", { user_id: data.from, type: "duel-reject" })
            notification.close();
          }
        }})
    }

    function handle_tournament_canceled(data){
      SimpleNotification.error({
        text: `The tournament "${data.name}" has been canceled (not enough participants)`
      })
    }

    function handle_tournament_start(data){
      SimpleNotification.message({
        text: `The tournament "${data.tournament_name} ${data.tournament_type}" started.`,
        buttons: [{
          value: 'Go to tournament',
          type: 'success',
          onClick(notification) {
            notification.close();
            return Router.router.navigate(`/game/tournaments/${data.tournament_id}`, { trigger: true });
          }
        }]
      })
    }

    function handle_tournament_created(data) {
      SimpleNotification.message({
        text: `New tournament "${data.tournament_name}" has been created.`,
        buttons: [{
          value: 'See details',
          type: 'message',
          onClick(notification) {
            notification.close();
            return Router.router.navigate(`/game/tournaments/${data.tournament_id}`, { trigger: true });
          }
        }]
      })
    }
  }); // window.onload
}

export default NotificationChannel;
