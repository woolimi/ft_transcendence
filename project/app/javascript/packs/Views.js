import _ from "underscore"
import Backbone from "backbone"

const GameContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-game']").html()),
	render: function() {
		const content = this.template(/* this.model.toJSON() */);
		this.$el.html(content);
		return this;
	}
});

const ProfileContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-profile']").html()),
	render: function () {
		const content = this.template();
		this.$el.html(content);
		return this;
	}
});

const GuildContent = Backbone.View.extend({
	template: _.template($("script[name='tmpl-content-guild']").html()),
	render: function () {
		const content = this.template();
		this.$el.html(content);
		return this;
	}
});

const NavItem = Backbone.View.extend({
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

export { 
	GameContent, 
	ProfileContent, 
	GuildContent,
	NavItem
};