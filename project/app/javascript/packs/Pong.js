import MatchChannel from "../channels/match_channel"
import $ from "jquery"

let Pong;

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

	const pressedKeys = { up: false, down: false };

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

	Pong = class Pong {
		constructor(wrapper, canvas, match_id) {
			if (!wrapper || !canvas)
				throw Error("No element");
			this.wrapper = document.getElementById("game-screen-wrapper");
			this.canvas = document.getElementById("game-screen");
			this.match_id = match_id;
			this.user_id = $('html').data().userId;
			this.context = this.canvas.getContext('2d');
			if (!this.context)
				throw Error("No context in constructor");
			this.resize();
			this.p1 = new Paddle(SIDE.LEFT);
			this.p2 = new Paddle(SIDE.RIGHT);
			this.ball = new Ball();
			this.resize_handler_on();
			this.draw();
			this.reqId = null;
		}
		resize() {
			if (!this.wrapper || !this.canvas)
				throw Error("No wrapper or canvas in resize");
			this.canvas.width = this.wrapper.offsetWidth;
			this.canvas.height = this.canvas.width / 2;
		}
		draw() {
			if (!this.context || !this.canvas)
				throw Error("No context or canvas in draw");
			// draw map
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.fillStyle = "white";
			this.context.fillRect(this.canvas.width / 2 - 1, 0, 2, this.canvas.height);
			// draw paddle
			this.p1.draw(this.context, this.canvas);
			this.p2.draw(this.context, this.canvas);
			// draw ball
			this.ball.draw(this.context, this.canvas);
		}

		update(data) {
			this.ball.update(data.ball);
			this.p1.update(data.player_1);
			this.p2.update(data.player_2);
		}

		resize_handler_on() {
			$(window).on("resize", () => {
				this.resize();
				this.draw();
			})
		}
		on() {
			this.keyListener_on();
			this.reqId = requestAnimationFrame(this.keyLoop.bind(this));
		}
		off() {
			this.keyListener_off();
			cancelAnimationFrame(this.reqId);
		}
		keyListener_on() {
			// $(window).on("keyup", keyup_cb);
			// $(window).on("keydown", keydown_cb);
			window.addEventListener("keyup", keyup_cb);
			window.addEventListener("keydown", keydown_cb);
		}
		keyListener_off() {
			// $(window).off("keyup");
			// $(window).off("keydown");
			window.removeEventListener("keyup", keyup_cb);
			window.removeEventListener("keydown", keydown_cb);
		}
		keyPressed(key) {
			if (key === "ArrowUp")
				return pressedKeys.up;
			if (key === "ArrowDown")
				return pressedKeys.down;
			return false;
		}
		async keyLoop() {
			if (!MatchChannel.channel) {
				return cancelAnimationFrame(this.reqId);
			}
			let move = 0;
			if (this.keyPressed("ArrowUp"))
				move += 1;
			if (this.keyPressed("ArrowDown"))
				move -= 1;
			if (move !== 0) {
				MatchChannel.channel.perform("game_data", {
					"from": this.user_id,
					"match_id": this.match_id,
					"move": (move === 1) ? "up" : "down",
				});
			}
			await sleep(0.5)
			this.reqId = requestAnimationFrame(this.keyLoop.bind(this));
		}
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}) 
}
export { Pong }