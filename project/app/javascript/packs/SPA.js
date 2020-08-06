import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Navbar from "./Navbar.js"
import UserModal from "./UserModal.js"
import Friends from "./Friends.js"

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
		Friends.searchUserModal.render();
	})
}

export default SPA;