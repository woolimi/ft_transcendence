import MatchChannel from "../channels/match_channel"
import $ from "jquery"
import Match from "./Match"

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

	let reqId = null;
	Pong = class Pong {
		constructor(match_id) {
			this.match_id = match_id;
			this.user_id = $('html').data().userId;
			this.resize();
			this.p1 = new Paddle(SIDE.LEFT);
			this.p2 = new Paddle(SIDE.RIGHT);
			this.ball = new Ball();
			this.resize_handler_on();
			this.draw();
			this.finished = false;
		}
		resize() {
			if (!Match.wrapper || !Match.canvas)
				throw Error("No wrapper or canvas in resize");
			Match.canvas.width = Match.wrapper.offsetWidth;
			Match.canvas.height = Match.canvas.width / 2;
		}
		draw() {
			if (!Match.wrapper || !Match.canvas)
				throw Error("No wrapper or canvas in draw");
			// draw map
			Match.canvas.getContext('2d').clearRect(0, 0, Match.canvas.width, Match.canvas.height);
			Match.canvas.getContext('2d').fillStyle = "white";
			Match.canvas.getContext('2d').fillRect(Match.canvas.width / 2 - 1, 0, 2, Match.canvas.height);
			// draw paddle
			this.p1.draw(Match.canvas.getContext('2d'), Match.canvas);
			this.p2.draw(Match.canvas.getContext('2d'), Match.canvas);
			// draw ball
			this.ball.draw(Match.canvas.getContext('2d'), Match.canvas);
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
			this.finished = false;
			if (!reqId)
				reqId = requestAnimationFrame(this.keyLoop.bind(this));
		}
		off() {
			this.keyListener_off();
			cancelAnimationFrame(reqId);
			reqId = null;
		}
		keyListener_on() {
			window.addEventListener("keyup", keyup_cb);
			window.addEventListener("keydown", keydown_cb);
		}
		keyListener_off() {
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
			await usleep(10);
			reqId = requestAnimationFrame(this.keyLoop.bind(this));
		}
	}

	function usleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

}) 
}
export { Pong }