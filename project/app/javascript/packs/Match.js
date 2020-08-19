import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Match = {};

$(() => {
	Match.Content = Backbone.View.extend({
		el: $("#view-content"),
		page_template: _.template($("script[name='tmpl-game-match']").html()),
		render_page: function () {
			this.$el.html(this.page_template());
			return this;
		},
		initialize: function(options) {
			this.options = options; // { type: "duel", ... }
			this.render_page();
		}
	});
})

export default Match;