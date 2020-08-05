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
			block_list: "{}",
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
			"click .unblock": "unblock",
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
		},

		unblock: function(e) {
			e.stopImmediatePropagation();
				const block_user = $(e.target).data();
				let res = confirm("Do you want to remove " + block_user.nickname + "(" + block_user.name + ")?");
				if (res === true) {
					var arr = this.model.get("block_list");
					console.log(arr);
					var i
					for (i = 0; i < arr.length; i++)
					{
						if(arr[i].user_id == block_user.user_id)
						{
							arr.splice(i, 1);
							break;
						}
					}
					this.model.set('block_list', arr);
					console.log(this.model.get("block_list"));
					this.model.save();
					this.render();
					// console.log(i);
					// this.model.set('block_list', '');
				}
		} 
	});

	Profile.content = new ProfileContentView();
})

} // if logged in

export default Profile;


/*


"checked or unchecked"



*/