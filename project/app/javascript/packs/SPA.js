import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Navbar from "./Navbar.js"
import UserModal from "./UserModal.js"
import Friends from "./Friends.js"
import MessageNotificationChannel from "../channels/message_notification_channel"
import Channel from "./Channel"
import NotificationChannel from '../channels/notification_channel'

const SPA = {}

SPA.start = function() {
	$(()=> {
		// please don't remove
		// const redirectToLogin = function () {
		// 	window.location.href = '/';
		// };
		// $.ajaxSetup({
		// 	statusCode: {
		// 		401: redirectToLogin,
		// 		403: redirectToLogin
		// 	}
		// });
		
		SimpleNotification.options({ position: 'bottom-center', duration: 6000 });

		Backbone.history.start();
		Backbone.history.loadUrl(Backbone.history.fragment);

		/* navbar user */
		Navbar.user.render();
		/* navbar items */
		Navbar.items.render();
		/* user info modal */
		UserModal.content.render();
		/* friend list */
		Friends.list.render();
		/* Channel & DM list */
		Channel.channel_list = new Channel.V_ChannelList();
		/* message notification channel */
		MessageNotificationChannel.subscribe();
		/* Notification channel */
		NotificationChannel.subscribe()
	})
}

export default SPA;