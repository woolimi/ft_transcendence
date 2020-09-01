import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper";
import Router from "./Router";

const Ladder = {};

if ($('html').data().isLogin) {

	$(() => {
		Ladder.Content = Backbone.View.extend({
			el: $("#view-content"),
			page_template: _.template($("script[name='tmpl-ladder-index']").html()),
			list_template: _.template($("script[name='tmpl-ladder-list']").html()),
			events: {
				"click #start-ladder-game": "start_ladder_game"
			},
			async initialize() {
				try {
					this.render_page();
					const list = await Helper.ajax(`/api/rank`, '', 'GET');
					this.render_list({ list: list });
				} catch (error) {
					console.error(error);
				}
			},
			render_page() {
				this.$el.html(this.page_template());
			},
			render_list(data) {
				this.$el.find("#ladder-rank-list").html(this.list_template(data));
			},
			async start_ladder_game(e) {
				try {
					e.stopImmediatePropagation();
					const new_match = await Helper.ajax('/api/matches/', `match_type=ladder`, 'POST');
					return Router.router.navigate(`/game/ladder/${new_match.id}`, { trigger: true });					
				} catch (error) {
					console.error(error);
				}
			}
		});
	})

}
export default Ladder;