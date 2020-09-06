import MatchChannel from "../channels/match_channel"
import $ from "jquery"
// import Match from "./Match"

let Pong = {};

if ($('html').data().isLogin) {

$(() => {
	var SIDE;
	(function (SIDE) {
		SIDE[SIDE["LEFT"] = 0] = "LEFT";
		SIDE[SIDE["RIGHT"] = 1] = "RIGHT";
	})(SIDE || (SIDE = {}));
	var CANVAS;
	(function (CANVAS) {
		CANVAS[CANVAS["WIDTH"] = 400] = "WIDTH";
		CANVAS[CANVAS["HEIGHT"] = 200] = "HEIGHT";
	})(CANVAS || (CANVAS = {}));
	function trans_coordiante(pos, canvas) {
		const trans_pos = {
			x: pos.x * canvas.width / CANVAS.WIDTH,
			y: pos.y * canvas.height / CANVAS.HEIGHT,
		};
		return trans_pos;
	}

	window.pressedKeys = { up: false, down: false };

	const keyup_cb = function (e) {
		if (e.code === "ArrowUp")
			pressedKeys.up = false;
		if (e.code === "ArrowDown")
			pressedKeys.down = false;
		if (e.code === "ArrowUp" || e.code === "ArrowDown")
			e.preventDefault();
	}
	const keydown_cb = function (e) {
		if (e.code === "ArrowUp")
			pressedKeys.up = true;
		if (e.code === "ArrowDown")
			pressedKeys.down = true;
		if (e.code === "ArrowUp" || e.code === "ArrowDown")
			e.preventDefault();
	}

	class Paddle {
		constructor(side) {
			this.speed = 4;
			this.width = 4;
			this.height = 20;
			this.score = 0;
			this.side = side;
			this.y = 90;
			this.x = (side === SIDE.LEFT ? 10 : 390);
		}
		draw(context, canvas) {
			const trans = trans_coordiante({ x: this.x, y: this.y }, canvas);
			context.fillRect(trans.x, trans.y, this.width * canvas.width / CANVAS.WIDTH, this.height * canvas.height / CANVAS.HEIGHT);
		}
		update(data) {
			this.x = data.x;
			this.y = data.y;
		}
	}
	class Ball {
		constructor() {
			this.r = 3;
			this.x = (CANVAS.WIDTH / 2);
			this.y = (CANVAS.HEIGHT / 2);
		}
		draw(context, canvas) {
			const trans = trans_coordiante({ x: this.x, y: this.y }, canvas);
			context.beginPath();
			context.arc(trans.x, trans.y, this.r * canvas.width / CANVAS.WIDTH, 0, 2 * Math.PI, false);
			context.fillStyle = 'white';
			context.fill();
		}
		update(data) {
			this.r = data.r;
			this.x = data.x;
			this.y = data.y;
		}
	}


	Pong.resize = function() {
		if (!Pong.wrapper || !Pong.canvas)
			throw Error("No wrapper or canvas in resize");
		Pong.canvas.width = Pong.wrapper.offsetWidth;
		Pong.canvas.height = Pong.canvas.width / 2;
	}
	Pong.draw = function() {
		if (!Pong.wrapper || !Pong.canvas)
			throw Error("No wrapper or canvas in draw");
		// draw map
		Pong.canvas.getContext('2d').clearRect(0, 0, Pong.canvas.width, Pong.canvas.height);
		Pong.canvas.getContext('2d').fillStyle = "white";
		Pong.canvas.getContext('2d').fillRect(Pong.canvas.width / 2 - 1, 0, 2, Pong.canvas.height);
		// draw paddle
		Pong.p1.draw(Pong.canvas.getContext('2d'), Pong.canvas);
		Pong.p2.draw(Pong.canvas.getContext('2d'), Pong.canvas);
		// draw ball
		Pong.ball.draw(Pong.canvas.getContext('2d'), Pong.canvas);
	}

	Pong.update = function(data) {
		Pong.ball.update(data.ball);
		Pong.p1.update(data.player_1);
		Pong.p2.update(data.player_2);
	}

	Pong.resize_handler_on = function() {
		$(window).on("resize", () => {
			Pong.resize();
			Pong.draw();
		})
	}
	Pong.keyListener_on = function() {
		window.addEventListener("keyup", keyup_cb);
		window.addEventListener("keydown", keydown_cb);
	}
	Pong.keyListener_off = function() {
		window.removeEventListener("keyup", keyup_cb);
		window.removeEventListener("keydown", keydown_cb);
	}
	Pong.on = function() {
		if(!window.finished){//window.reqId != undefined){
			Pong.off()
		}
		Pong.keyListener_on();
		window.finished = false;
		// window.reqId = 
		Pong.keyLoop()
		// window.requestAnimationFrame()
	}
	Pong.off = function() {
		Pong.keyListener_off();
		console.log('off', window.reqId)
		// window.cancelAnimationFrame(window.reqId);
		window.finished = true;
		// window.reqId = undefined;
	}
	Pong.usleep = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	Pong.setup = function() {
		Pong.wrapper = document.getElementById("game-screen-wrapper");
		Pong.canvas = document.getElementById("game-screen");
		Pong.resize();
		Pong.p1 = new Paddle(SIDE.LEFT);
		Pong.p2 = new Paddle(SIDE.RIGHT);
		Pong.ball = new Ball();
		Pong.resize_handler_on();
		Pong.draw();
		Pong.off()
	}
	Pong.keyLoop = async function() {
		console.log('on', window.reqId)
		if(window.finished)
			return;
		let move = 0;
		if (window.pressedKeys.up)
			move += 1;
		if (window.pressedKeys.down)
			move -= 1;
		if (move !== 0) {
			console.log('move', move)
			MatchChannel.channel.perform("game_data", {
				"from": window.user_id,
				"match_id": window.id,
				"move": (move === 1) ? "up" : "down",
			});
		}
		await Pong.usleep(40);
		window.reqId = window.requestAnimationFrame(Pong.keyLoop);
	}


}) 
}

export default Pong;