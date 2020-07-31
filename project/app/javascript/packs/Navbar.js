import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Navbar = {};

if ($('html').data().isLogin) {
$(() => {
	/* Model */
	const CurrentRoute = Backbone.Model.extend({
		defaults: {
			route: "game"
		}
	});

	const User = Backbone.Model.extend({
		defaults: {
			user_id: $('html').data().userId,
			name: "undefined",
			nickname: "undefined",
			avatar_url: "#",
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
	Navbar.currentRoute = new CurrentRoute();
	const user = new User();

	/* View */
	const NavItemsView = Backbone.View.extend({
		el: $("#view-nav-item"),
		template: _.template($("script[name='tmpl-nav-item']").html()),
		model: Navbar.currentRoute,
		initialize: function () {
			this.listenTo(this.model, "change", this.render);
		},
		render: function () {
			const content = this.template(this.model.toJSON());
			this.$el.html(content);
			return this;
		}
	});

	const NavUserView = Backbone.View.extend({
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
	Navbar.items = new NavItemsView();
	Navbar.user = new NavUserView();
})

} // if user logged in

export default Navbar;