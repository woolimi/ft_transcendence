import _ from "underscore"
import Backbone from "backbone"

class LoginView extends Backbone.View {
	initialize() {
		this.template = $('script[name="login"]').html();
	}
	render() {
		$("#app").html(_.template(this.template));
		return this;
	}
}

class GameView extends Backbone.View {
	initialize() {
		this.template = $('script[name="game"]').html();
	}
	render() {
		$("#app").html(_.template(this.template));
		return this;
	}
}

export { LoginView, GameView };