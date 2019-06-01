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
}

class Ball extends Rect {
  constructor() {
    super(10,10);
    this.vel = new Vec;
  }
}

// Refering to 'pong' in the HTML
const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

// Created the ball and choosing its x and y positiion to move around the 'pong arena'
const ball = new Ball
ball.pos.x = 100;
ball.pos.y = 50;

ball.vel.x = 100;
ball.vel.y = 100;
// ms = milliseconds. /1000 converts to seconds. This function is calculating the time
// difference so the ball can register pace. 
let lastTime;
const callBack = (ms) => {
  if(lastTime) {
    update((ms - lastTime) / 1000);
  }
  lastTime = ms;
  requestAnimationFrame(callBack);
}

// dt = delta time. This function means movement of the ball is relative to the
// time difference.
const update = (dt) => {
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;


// This creates the black square that is the 'pong area'
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#fff';
  context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

callBack()