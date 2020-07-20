import _ from "underscore"
import Backbone from "backbone"

const Views = {};

Views.GameContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-game']").html()),
	render: function() {
		const content = this.template(/* this.model.toJSON() */);
		this.$el.html(content);
		return this;
	}
});

Views.ProfileContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-profile']").html()),
	initialize: function (options) {
		this.route_model = options.route_model;
		this.listenTo(this.model, "change", this.change);
	},
	render: function () {
		const content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	},
	change: function () {
		if (this.route_model.toJSON().route === "profile") {
			this.render();
		}
	},
});

Views.GuildContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-guild']").html()),
	render: function () {
		const content = this.template();
		this.$el.html(content);
		return this;
	}
});

Views.NavItem = Backbone.View.extend({
	template: _.template($("script[name='tmpl-nav-item']").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function () {
		const content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	}
});

Views.NavUser = Backbone.View.extend({
	template: _.template($("script[name='tmpl-nav-user']").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.render();
	},
	render: function() {
		const content = this.template(this.model.toJSON());
		this.$el.html(content);
		return this;
	}
});

export default Views;