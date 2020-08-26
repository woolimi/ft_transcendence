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
var DIRECTION;
(function (DIRECTION) {
	DIRECTION[DIRECTION["IDLE"] = 0] = "IDLE";
	DIRECTION[DIRECTION["UP"] = 1] = "UP";
	DIRECTION[DIRECTION["DOWN"] = 2] = "DOWN";
	DIRECTION[DIRECTION["LEFT"] = 3] = "LEFT";
	DIRECTION[DIRECTION["RIGHT"] = 4] = "RIGHT";
})(DIRECTION || (DIRECTION = {}));
function trans_coordiante(pos, canvas) {
	const trans_pos = {
		x: pos.x * canvas.width / CANVAS.WIDTH,
		y: pos.y * canvas.height / CANVAS.HEIGHT,
	};
	return trans_pos;
}

function p_setTimeout(i, timer) {
	return new Promise((res) => {
		setTimeout(() => {
			if (i > 0)
				timer.innerHTML = i.toString();
			else {
				timer.innerHTML = 'GO';
			}
			res(true);
		}, 1000);
	});
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
}
class Ball {
	constructor() {
		this.r = 3;
		this.x = (CANVAS.WIDTH / 2);
		this.y = (CANVAS.HEIGHT / 2);
		this.moveX = DIRECTION.IDLE;
		this.moveY = DIRECTION.IDLE;
		this.speed = 3;
	}
	stop() {
		this.x = (CANVAS.WIDTH / 2);
		this.y = (CANVAS.HEIGHT / 2);
		this.moveX = DIRECTION.IDLE;
		this.moveY = DIRECTION.IDLE;
	}
	start() {
		this.x = (CANVAS.WIDTH / 2);
		this.y = (CANVAS.HEIGHT / 2);
		this.moveX = Math.floor(Math.random() * 2) ? DIRECTION.LEFT : DIRECTION.RIGHT;
		this.moveY = Math.floor(Math.random() * 2) ? DIRECTION.UP : DIRECTION.DOWN;
	}
	draw(context, canvas) {
		const trans = trans_coordiante({ x: this.x, y: this.y }, canvas);
		context.beginPath();
		context.arc(trans.x, trans.y, this.r * canvas.width / CANVAS.WIDTH, 0, 2 * Math.PI, false);
		context.fillStyle = 'white';
		context.fill();
	}
}
class Game {
	constructor(timer, wrapper, canvas) {
		if (!timer || !wrapper || !canvas)
			throw Error("No element");
		this.req_id = 0;
		this.max_score = 3;
		this.over = true;
		this.timer = timer;
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
		if (!this.wrapper || !this.canvas || !this.timer)
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
	async update() {
		if (!this.over) {
			if (!this.canvas)
				throw Error("No canvas in update");
			// Update player position
			if (keyListener.is_pressed("up"))
				this.p1.move(DIRECTION.UP);
			if (keyListener.is_pressed("down"))
				this.p1.move(DIRECTION.DOWN);
			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.x <= 0) {
				this.p2.score++;
				this.over = true;
			}
			if (this.ball.x >= CANVAS.WIDTH) {
				this.p1.score++;
				this.over = true;
			}
			if (this.ball.y <= 0)
				this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= CANVAS.HEIGHT)
				this.ball.moveY = DIRECTION.UP;

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP)
				this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN)
				this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT)
				this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT)
				this.ball.x += this.ball.speed;
			
				// Handle p1-Ball collisions
			if (this.ball.x - this.ball.r <= this.p1.x && this.ball.x >= this.p1.x - this.p1.width) {
				if (this.ball.y <= this.p1.y + this.p1.height && this.ball.y + this.ball.r >= this.p1.y) {
					this.ball.x = (this.p1.x + this.ball.r);
					this.ball.moveX = DIRECTION.RIGHT;
				}
			}
			// Handle p2-Ball collision
			if (this.ball.x - this.ball.r <= this.p2.x && this.ball.x >= this.p2.x - this.p2.width) {
				if (this.ball.y <= this.p2.y + this.p2.height && this.ball.y + this.ball.r >= this.p2.y) {
					this.ball.x = (this.p2.x - this.ball.r);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}
		}
	}
	resize_handler_on() {
		window.addEventListener("resize", () => {
			this.resize();
			this.draw();
		});
	}
	async loop() {
		this.update();
		this.draw();
		if (!this.over) {
			this.req_id = requestAnimationFrame(this.loop.bind(this));
		}
		else {
			if (this.p1.score === 3 || this.p2.score === 3) {
				this.timer.innerHTML = "FINISHED";
				this.ball.stop();
				keyListener.off();
				window.cancelAnimationFrame(this.req_id);
			} else {
				this.over = false;
				this.ball.stop();
				this.req_id = requestAnimationFrame(this.loop.bind(this));
				await this.set_timer();
				this.ball.start();
			}
		}
	}
	async start() {
		this.over = false;
		this.req_id = window.requestAnimationFrame(this.loop.bind(this));
		keyListener.on();
		await this.set_timer();
		this.ball.start();
	}
	async set_timer() {
		this.timer.innerHTML = '3';
		for (let i = 2; i >= 0; i--) {
			await p_setTimeout(i, this.timer);
		}
	}
}


export { Game, keyListener }