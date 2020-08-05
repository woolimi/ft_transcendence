import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Guild = {};

$(() => {

	const GuildContent = Backbone.View.extend({
		el: $("#view-content"),
		template: _.template($("script[name='tmpl-content-guild']").html()),
		render: function () {
			const content = this.template();
			this.$el.html(content);
			return this;
		}
	});
	
	Guild.content = new GuildContent();
})

export default Guild;