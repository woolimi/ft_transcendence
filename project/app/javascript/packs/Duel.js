import $ from "jquery"
import _ from "underscore"
import Backbone from "backbone"
import Helper from "./Helper";
import Router from "./Router";

const Duel = {};

if ($('html').data().isLogin) {

	$(() => {
		Duel.Content = Backbone.View.extend({
			el: $("#view-content"),
			page_template: _.template($("script[name='tmpl-duel-index']").html()),
			events: {
				"click #start-duel-game": "start_duel_game"
			},
			async initialize() {
				try {
					this.render_page();
				} catch (error) {
					console.error(error);
				}
			},
			render_page() {
				this.$el.html(this.page_template());
			},
			async start_duel_game(e) {
				try {
					e.stopImmediatePropagation();
					const new_match = await Helper.ajax('/api/matches/', `match_type=duel`, 'POST');
					return Router.router.navigate(`/game/duel/${new_match.id}`, { trigger: true });
				} catch (error) {
					console.error(error);
				}
			}
		});
	})

}
export default Duel;