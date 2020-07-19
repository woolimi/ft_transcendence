import Backbone from "backbone";
import { LoginView, GameView } from "./Views.js";

class Router extends Backbone.Router {
	get routes() {
		return {
			"": "login", // default page
			"game": "game",
			"login": "login"
		}
	}
	login() {
		const loginView = new LoginView();
		if ($("html").data().islogin === true)
			this.navigate("game", { trigger: true });
		else
			loginView.render();
	}
	game() {
		const gameView = new GameView();
		if ($("html").data().islogin === false)
			this.navigate("login", { trigger: true });
		else
			gameView.render();
	}
}

export default Router;