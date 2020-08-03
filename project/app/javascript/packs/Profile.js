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
			this.model.set('nickname', $('.nickname-update').val());
        	this.model.set('name', $('.name-update').val());
			this.model.set('avatar_url', $('.avatar_url-update').val());
			console.log(this.model.toJSON());
			e.preventDefault();
			this.model.save();
		}
	});

	Profile.content = new ProfileContentView();
})

} // if logged in

export default Profile;