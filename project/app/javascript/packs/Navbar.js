import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper";

const Navbar = {};

if ($('html').data().isLogin) {
$(() => {
	/* Model */
	Navbar.CurrentRoute = Backbone.Model.extend({
		defaults: {
			route: "game"
		}
	});

	Navbar.User = Backbone.Model.extend({
		defaults: {
			user_id: $('html').data().userId,
			name: "undefined",
			nickname: "undefined",
			avatar_url: "#",
			block_list: [],
		},
		urlRoot: "/api/user_info/",
		idAttribute: 'user_id',
		initialize: function () {
			this.fetch();
		},
		url: function () {
			return this.urlRoot + encodeURIComponent(this.get('user_id'));
		},
	})

	/* export currentRoute model for binding with route event */
	Navbar.currentRoute = new Navbar.CurrentRoute();
	const user = new Navbar.User();
	Navbar.userModel = user;


	/* View */
	Navbar.NavItemsView = Backbone.View.extend({
		el: $("#view-nav-item"),
		template: _.template($("script[name='tmpl-nav-item']").html()),
		model: Navbar.currentRoute,
		user_id: $('html').data().userId,
		me: {},
		initialize: async function () {
			this.me = await Helper.ajax(`/api/profile/${this.user_id}`);
			this.listenTo(this.model, "change", this.render);
			this.render()
		},
		render: function () {
			const content = this.template({
				model: this.model.toJSON(),
				admin: this.me.admin
			});
			this.$el.html(content);
			return this;
		}
	});

	Navbar.NavUserView = Backbone.View.extend({
		template: _.template($("script[name='tmpl-nav-user']").html()),
		el: $("#view-nav-user"),
		model: user,
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
		},
		render: function () {
			const content = this.template(this.model.toJSON());
			this.$el.html(content);
			return this;
		}
	});

	/* instanciate view */
	Navbar.items = new Navbar.NavItemsView();
	Navbar.user = new Navbar.NavUserView();
})

} // if user logged in

export default Navbar;