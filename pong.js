// Creating 2 classes for movement and a class which is the ball.
class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) {
    this.pos = new Vec
    this.size = new Vec(w, h)
  }
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y - this.size.y / 2;
  }
}
// Creating ball class so we can create the ball
class Ball extends Rect {
  constructor() {
    super(10,10);
    this.vel = new Vec;
  }
}
// Creating player class so we can create players
class Player extends Rect {
  constructor() {
    super(20,100);
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    // Starting Position of ball/creation of the ball. Initializing in class.
    this.ball = new Ball

    this.ball.pos.x = 100;
    this.ball.pos.y = 50;

    this.ball.vel.x = 100;
    this.ball.vel.y = 100;

    // Players array
    this.player = [
      new Player,
      new Player,
    ];
    // Movies player 1[0] and 2[1] out into the middle of the area
    this.player[0].pos.x = 40;
    this.player[1].pos.x = this._canvas.width - 40;
    this.player.forEach(player => {
      player.pos.y = this._canvas.height / 2;
    })

    // ms = milliseconds. /1000 converts to seconds. This function is calculating the time
    // difference so the ball can register pace. 
    let lastTime;
    const callBack = (ms) => {
      if(lastTime) {
        this.update((ms - lastTime) / 1000);
      }
      lastTime = ms;
      requestAnimationFrame(callBack);
    }
    callBack();
  }
  // 
  draw() {
    // This creates the black square that is the 'pong area'
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, 
        this._canvas.width, this._canvas.height);
      
    this.drawRect(this.ball);
    // Drawing both the players in the pong 'arena'
    this.player.forEach(player => this.drawRect(player));
  }
  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, 
                            rect.size.x, rect.size.y);
  }
    // dt = delta time. This function means movement of the ball is relative to the
    // time difference.
  update(dt) {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    //To stop ball from flying out of the box
    if(this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.vel.x = - this.ball.vel.x;
    }
    if(this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }
    // This makes player 2[1] follow the y axis of the ball. Meaning it will stay at the same level 
    // on the top to bottom axis.
    this.player[1].pos.y = this.ball.pos.y;

    this.draw()
  }
}

// Refering to 'pong' in the HTML
const canvas = document.getElementById('pong');

// Initializing a new pong class/new game
const pong = new Pong(canvas)

canvas.addEventListener('mousemove',event => {
  pong.player[0].pos.y = event.offsetY;
})