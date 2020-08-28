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
        received: async function(data) {
					console.log(data)
					switch(data.type){
						// case 'coucou':
						// 	SimpleNotification.message({ 
						// 		title: 'Coucou',
						// 		text: `Hello from ${data.content.senderName}`
						// 	})
						// break;
						default:
							break;
					}
				},
				// connected() {},
        // disconnected() {},
        // rejected() {}
      }); 
    }
    
  }); // window.onload
}

export default NotificationChannel;
