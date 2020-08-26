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

class KeyListener {
	constructor() {
		this.pressedKeys = { up: false, down: false };
	}
	on() {
		document.addEventListener("keyup", keyup_cb);
		document.addEventListener("keydown", keydown_cb);
	}
	off() {
		document.removeEventListener("keyup", keyup_cb);
		document.removeEventListener("keydown", keydown_cb);
	}
	is_pressed(key) {
		if (key === "ArrowUp" || key === "up")
			return this.pressedKeys.up;
		if (key === "ArrowDown" || key === "down")
			return this.pressedKeys.down;
		return false;
	}
}

const keyListener = new KeyListener();
function keyup_cb(e) {
	if (e.code === "ArrowUp")
		keyListener.pressedKeys.up = false;
	if (e.code === "ArrowDown")
		keyListener.pressedKeys.down = false;
	if (e.code === "ArrowUp" || e.code === "ArrowDown")
		e.preventDefault();
}
function keydown_cb(e) {
	if (e.code === "ArrowUp")
		keyListener.pressedKeys.up = true;
	if (e.code === "ArrowDown")
		keyListener.pressedKeys.down = true;
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
	move(dir) {
		if (dir === DIRECTION.UP)
			this.y -= this.speed;
		else if (dir === DIRECTION.DOWN)
			this.y += this.speed;
		if (this.y < 0)
			this.y = 0;
		if (this.y > CANVAS.HEIGHT - this.height)
			this.y = CANVAS.HEIGHT - this.height;
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
class Game {
	constructor(wrapper, canvas) {
		if (!wrapper || !canvas)
			throw Error("No element");
		this.wrapper = wrapper;
		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');
		if (!this.context)
			throw Error("No context in constructor");
		this.resize();
		this.p1 = new Paddle(SIDE.LEFT);
		this.p2 = new Paddle(SIDE.RIGHT);
		this.ball = new Ball();
		this.resize_handler_on();
		this.draw();
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
		this.p1.update(data.player1);
		this.p2.update(data.player2);
	}

	resize_handler_on() {
		window.addEventListener("resize", () => {
			this.resize();
			this.draw();
		});
	}
	start() {
		keyListener.on();
	}
}

// 	if(keyListener.is_pressed("up"))
//    this.p1.move(DIRECTION.UP);
//  if (keyListener.is_pressed("down"))
// 	  this.p1.move(DIRECTION.DOWN);

export { Game, keyListener }