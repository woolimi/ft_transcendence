import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"

const Tournament = {};

$(() => {

	const TournamentContent = Backbone.View.extend({
		el: $("#view-content"),
		// template: _.template($("script[name='tmpl-tournaments-list']").html()),
		render: function () {
			// const content = this.template();
			let content = 'Here is a tournament [todo]'
			this.$el.html(content);
			return this;
		}
	});
	
	Tournament.content = new TournamentContent();
})

export default Tournament;