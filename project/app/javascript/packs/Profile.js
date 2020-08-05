import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Navbar from "./Navbar.js"


const Profile = {};

if ($('html').data().isLogin) {
$(() => {

	/* Model */
	const User = Backbone.Model.extend({
		defaults: {
			user_id: $('html').data().userId,
			name: "undefined",
			nickname: "undefined",
			avatar_url: "#",
			friend_list: "{}",
			two_factor: "undefined"
		},
		urlRoot: "/api/profile/",
		idAttribute: 'user_id',
		initialize: function () {
			this.fetch();
		},
		url: function () {
			return this.urlRoot + encodeURIComponent(this.get('user_id'));
		},
	})

	const user = new User();

	/* View */
	const ProfileContentView = Backbone.View.extend({
		template: _.template($("script[name='tmpl-content-profile']").html()),
		el: $("#view-content"),
		model: user,
		initialize: function (options) {
			this.listenTo(this.model, "change", this.change);
		},
		render: function () {
			const content = this.template(this.model.toJSON());
			this.$el.html(content);
			// console.log(this.model.toJSON());
			return this;
		},
		change: function () {
			if (Navbar.currentRoute.get('route') === "profile") {
				this.render();
			}
		},
		events: {
			"submit": "onSubmit",
		},
		
		onSubmit: function(e) {
			e.preventDefault();
			const two_factor = document.getElementById("twofactor").checked ? "on" : "off";
			this.model.set({
				nickname: $('.nickname-update').val(),
				name: $('.name-update').val(),
				avatar_url: $('.avatar_url-update').val(),
				two_factor: two_factor
			});
			const self = this;
			this.model.save();
		}
	});

	Profile.content = new ProfileContentView();
})

} // if logged in

export default Profile;


/*


"checked or unchecked"



*/