// Creating 2 classes for movement and a class which is the ball.
class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set len(value) {
    const fact = value / this.len;
    this.x *= fact;
    this.y *= fact;
  }
}

class Rect {
  constructor(x = 0, y = 0){
        this.pos = new Vec(0, 0);
        this.size = new Vec(x, y);
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
      super(20, 100);
      this.vel = new Vec;
      this.score = 0;

      this._lastPos = new Vec;
  }
  update(dt)
  {
      this.vel.y = (this.pos.y - this._lastPos.y) / dt;
      this._lastPos.y = this.pos.y;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    // Starting Position of ball/creation of the ball. Initializing in class.
    this.ball = new Ball

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

    //  THIS BIT WILL IS A BIT CONFUSING - SCORE CARD
  // BELOW IS A 0 1 being on(white) and 0 being off(black)
    this.CHAR_PIXEL = 10;
    this.Chars = [
      // 111
      // 101
      // 101
      // 101
      // 111 - literally looks like a 0
      // 0
      '111101101101111',
      // 1
      '010010010010010',
      // 2
      '111001111100111',
      // 3
      '111001111001111',
      // 4
      '101101111001001',
      // 5
      '111100111001111',
      // 6
      '111100111101111',
      // 7
      '111001001001001',
      // 8
      '111101111101111',
      // 9
      '111101111001111',
    ].map(str => {
      // goes through the canvas and fills it with a white square if theres a 1
      const canvas = document.createElement('canvas');
      canvas.height = this.CHAR_PIXEL * 5;
      canvas.width = this.CHAR_PIXEL * 3;
      const context = canvas.getContext('2d')
      context.fillStyle = '#fff'
      str.split('').forEach((fill, i) => {
        if(fill === '1'){
          context.fillRect(
            (i % 3) * this.CHAR_PIXEL,
            (i / 3 | 0) *this.CHAR_PIXEL,
            this.CHAR_PIXEL,
            this.CHAR_PIXEL);
        }
      }) 
      return canvas;
    })

    this.reset();
  }


  collide(player, ball)
  {
  if (player.left < ball.right && player.right > ball.left &&
      player.top < ball.bottom && player.bottom > ball.top) {
      ball.vel.x = -ball.vel.x * 1.05;
      const len = ball.vel.len;
      ball.vel.y += player.vel.y * .2;
      ball.vel.len = len;
    }
  }
  // function to draw ball and players on screen
  draw() {
    // This creates the black square that is the 'pong area'
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, 
        this._canvas.width, this._canvas.height);
      
    this.drawRect(this.ball);
    // Drawing both the players in the pong 'arena'
    this.player.forEach(player => this.drawRect(player));

    this.drawScore();
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, 
                            rect.size.x, rect.size.y);

  }

  drawScore() {
    const align = this._canvas.width / 3;
    const CHAR_W = this.CHAR_PIXEL * 4;
    this.player.forEach((player, index) => {
      // turning the score into a string for drawing the score.
      const chars = player.score.toString().split('');
      const offset = align * 
                    (index + 1) -
                    (CHAR_W * chars.length / 2)
                    + this.CHAR_PIXEL / 2;
        chars.forEach((char, pos) => {
              this._context.drawImage(this.Chars[char|0],
                                    offset + pos * CHAR_W, 20);
      })
    })
  }

  reset() {
    // this puts ball in the middle
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;

    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  start() {
    // if the ball doesnt move vvv
    if(this.ball.vel.x === 0 && this.ball.vel.y === 0) {
    // sets balls veloctiy to 300
    // Randomises a way the ball will travel on the beginning.
      this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1)
      this.ball.vel.y = 300 * (Math.random() * 2 -1)
      this.ball.vel.len = 200;
    }
  }
    // dt = delta time. This function means movement of the ball is relative to the
    // time difference.
    update(dt)
    {
        const cvs = this._canvas;
        const ball = this.ball;
        ball.pos.x += ball.vel.x * dt;
        ball.pos.y += ball.vel.y * dt;

        if (ball.right < 0 || ball.left > cvs.width) {
            ++this.player[ball.vel.x < 0 | 0].score;
            this.reset();
        }

        if (ball.vel.y < 0 && ball.top < 0 ||
            ball.vel.y > 0 && ball.bottom > cvs.height) {
            ball.vel.y = -ball.vel.y;
        }

        this.player[1].pos.y = ball.pos.y;

        this.player.forEach(player => {
            player.update(dt);
            this.collide(player, ball);
        });
        this.draw();
    }
}

// Refering to 'pong' in the HTML
const canvas = document.getElementById('pong');

// Initializing a new pong class/new game
const pong = new Pong(canvas)

// Makes player1[0] block follow mouse
canvas.addEventListener('mousemove',event => {
  const scale = event.offsetY / event.target.getBoundingClientRect().height;
  pong.player[0].pos.y = canvas.height * scale;
})

// Starts game with a click
canvas.addEventListener('click',event => {
  pong.start()
})