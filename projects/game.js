let myXPos = 304;
let myYPos = 534;
let redEllipses = [];
let blueEllipses = [];
let score = 0;
let lives = 3;
let gameover = false;
let win = false; 
let kirbyImage;
let waddledImage;
let dedeImage;
let bg;

const KIRBY_WIDTH = 50;
// Counter for red ellipses
let redCounter = 0; 
// Counter for blue ellipses
let blueCounter = 0; 
// Delay for red ellipses (in frames)
const RED_ELLIPSE_DELAY = 70;
// Delay for blue ellipses (in frames)
const BLUE_ELLIPSE_DELAY = 90; 
function setup() {
  bg = loadImage("images/Kirbybg.png")
  createCanvas(600, 690);
  noStroke();
  rectMode(CENTER);
}

function preload(){
    kirbyImage = loadImage("images/Kirby.png")
    waddledImage = loadImage("images/WaddleD.png")
    dedeImage = loadImage("images/Dede.png")
}


function Kirby() {
  fill(255, 0, 0);
  // Move Kirby to the left
  if (keyIsDown(LEFT_ARROW) && myXPos > KIRBY_WIDTH / 2) {
    myXPos -= 4;
  }
  // Move Kirby to the right
  if (keyIsDown(RIGHT_ARROW) && myXPos < width - KIRBY_WIDTH / 2) {
    myXPos += 4;
  }

  image(kirbyImage, myXPos - KIRBY_WIDTH / 2, myYPos - KIRBY_WIDTH / 2, KIRBY_WIDTH, KIRBY_WIDTH);
}
//You can delete this when the project is done, but what this does is tell the exact coordinates of the mouse on the canvas
function mouseCoordinates() {
  
  stroke(0);
  noFill();
}

//displays scoreboard
function displayScoreboard() {
  fill(0, 255, 0);
  textSize(20);
  text("Score: " + score, 20, 30);
}

//displays lives
function displayLives() {
  fill(255, 0, 0);
  textSize(20);
  text("Lives: " + lives, 20, 60);
}

function draw() {
  background(bg);
  if (!gameover && !win) {
    Kirby();

    mouseCoordinates();

    if (redCounter >= RED_ELLIPSE_DELAY) {
      redEllipses.push(new RedEllipse());
      // Reset the counter
      redCounter = 0;
    }

    if (blueCounter >= BLUE_ELLIPSE_DELAY) {
      blueEllipses.push(new BlueEllipse());
      // Reset the counter
      blueCounter = 0;
    }
    // Increment the red ellipse counter
    redCounter++; 
    // Increment the blue ellipse counter
    blueCounter++; 

    for (let i = redEllipses.length - 1; i >= 0; i--) {
      let ellipseObj = redEllipses[i];
      ellipseObj.move();
      ellipseObj.display();

      if (ellipseObj.isCollidingWithKirby() || ellipseObj.isOffscreen()) {
        redEllipses.splice(i, 1);

        if (ellipseObj.isCollidingWithKirby()) {
          lives--;
          if (lives === 0) {
            gameover = true;
          }
        }
      }
    }

    for (let i = blueEllipses.length - 1; i >= 0; i--) {
      let ellipseObj = blueEllipses[i];
      ellipseObj.move();
      ellipseObj.display();

      if (ellipseObj.isCollidingWithKirby() || ellipseObj.isOffscreen()) {
        blueEllipses.splice(i, 1);

        if (ellipseObj.isCollidingWithKirby()) {
          score++;
        }
      }
    }
// Check if the player has collected 20 points
    if (score >= 20) { 
      win = true;
    }
  }
// Game Won and Game Over Scenarios
  if (gameover) {
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Your rampage was stopped...", width / 2, height / 2);
  } else if (win) {
    fill(0,0,0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("You Win! But at what cost...", width / 2, height / 2);
    

  }

  displayScoreboard();
  displayLives();
}

class RedEllipse {
  constructor() {
    this.x = random(width); // Random starting x position
    this.y = 0; // Start from the top of the screen
    this.speed = random(2, 5); // Random falling speed
    this.size = random(20, 40); // Random ellipse size
  }

  display() {
    fill(255, 0, 0);
    image(dedeImage, this.x, this.y, this.size, this.size);
    noStroke();
  }

  move() {
    // Move the ellipse downwards
    this.y += this.speed; 
  }

  isOffscreen() {
    // Check if the ellipse is off the bottom of the screen
    return this.y > height; 
  }

  isCollidingWithKirby() {
    let kirbyLeft = myXPos - KIRBY_WIDTH / 2;
    let kirbyRight = myXPos + KIRBY_WIDTH / 2;
    let kirbyTop = myYPos - KIRBY_WIDTH / 2;
    let kirbyBottom = myYPos + KIRBY_WIDTH / 2;

    let ellipseLeft = this.x - this.size / 2;
    let ellipseRight = this.x + this.size / 2;
    let ellipseTop = this.y - this.size / 2;
    let ellipseBottom = this.y + this.size / 2;

    return (
      ellipseLeft < kirbyRight &&
      ellipseRight > kirbyLeft &&
      ellipseTop < kirbyBottom &&
      ellipseBottom > kirbyTop
    );
  }
}

class BlueEllipse {
  constructor() {
    this.size = 30;
    this.x = this.getRandomPosition();
    this.y = 0;
    this.speed = random(4, 7);
  }

  getRandomPosition() {
    let minSpacing = 80;
    let xPos = random(width);
    for (let ellipseObj of blueEllipses) {
      if (abs(xPos - ellipseObj.x) < minSpacing) {
        xPos = this.getRandomPosition();
        break;
      }
    }
    return xPos;
  }

  display() {
    fill(0, 0, 255);
    image(waddledImage, this.x, this.y, this.size, this.size);
    noStroke();
  }

  move() {
    this.y += this.speed;
  }

  isOffscreen() {
    return this.y > height;
  }

//collision mechanics
  isCollidingWithKirby() {
    let kirbyLeft = myXPos - KIRBY_WIDTH / 2;
    let kirbyRight = myXPos + KIRBY_WIDTH / 2;
    let kirbyTop = myYPos - KIRBY_WIDTH / 2;
    let kirbyBottom = myYPos + KIRBY_WIDTH / 2;

    let ellipseLeft = this.x - this.size / 2;
    let ellipseRight = this.x + this.size / 2;
    let ellipseTop = this.y - this.size / 2;
    let ellipseBottom = this.y + this.size / 2;

    return (
      ellipseLeft < kirbyRight &&
      ellipseRight > kirbyLeft &&
      ellipseTop < kirbyBottom &&
      ellipseBottom > kirbyTop
    );
  }
}