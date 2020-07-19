import Backbone from "backbone"
import Router from "./Router.js";

class SPA {
	constructor() {
		new Router();
		Backbone.history.start();		
	}
}

export default SPA;
