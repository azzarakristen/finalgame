let xPosFairy = 175;
let xSpeedFairy = 0;
let cloudSpeed = 4;
let goldSpeed = 4;
let score = 0;
let level = 1;
let clouds = [];
let gold = [];
let newScoreBracket = true;
let gameState = "start";

const goldSound = new Tone.Player("sound/ding.mp3").toDestination();
const collisionSound = new Tone.Player("sound/buzz.wav").toDestination();
const levelupSound = new Tone.Player("sound/levelup.mp3").toDestination();

let img1, img2, img3;

function preload() {
  img1 = loadImage("images/myfairy.png");
  img2 = loadImage("images/stormcloud1.png");
  img3 = loadImage("images/gold2.png");
  img4= loadImage("images/background7.png");
}

function setup() {
  Tone.start();
  createCanvas(400, 600);

  spawnClouds(2);
  spawnGold(1);
}


function draw() {
  if (gameState === "start") {
    // Start Screen
    background(29, 63, 117); // Set background color
    textSize(30);
    fill(255);
    text("Press SPACE to Begin", 45, height / 2 - 30);
    textSize(17);
    text("Collect the gold, but beware of the storm.", 45, height / 2 + 30);


    // Check for key press to start the game
    if (keyIsPressed && key === " ") {
      gameState = "playing";
    }
  } else if (gameState === "playing") {
    // Game Screen
    if (level % 2 === 0) {
      background(148, 182, 242);
    } else if (level % 3 === 0) {
      background(78, 137, 237);
    } else {
      background(200, 220, 255);
    }

    img4.resize(400, 600);
    img1.resize(60, 75);
    img2.resize(80, 80);
    img3.resize(60, 60);

    image(img4, 0, 0);

    // display fairy
    image(img1, xPosFairy, 500);
    xPosFairy += xSpeedFairy;

    // fairy collision with sides
    if (xPosFairy < 0 || xPosFairy > width - 50) {
      gameState = "gameOver";
    }

    // display clouds and gold
    updateElements(img2, clouds, cloudSpeed, spawnClouds);
    updateElements(img3, gold, goldSpeed, spawnGold);

    // collisions function
    handleCollisions();

    // score function
    displayScore();
    displayLevel();
  } else if (gameState === "gameOver") {
    // Game Over Screen
    background(29, 63, 117); // Set background color
    textSize(40);
    fill(255);
    text("Game Over :(", 75, height / 2 - 30);
    textSize(20);
    text("Press SPACE to Restart", 85, height / 2 + 30);

    // Check for key press to restart the game
    if (keyIsPressed && key === " ") {
      gameState = "playing";
      resetLevel();
    }
  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) xSpeedFairy = -2.5;
  else if (keyCode == RIGHT_ARROW) xSpeedFairy = 2.5;
}

function updateElements(img, elements, speed, spawnFunction) {
  for (let i = 0; i < elements.length; i++) {
    // Display the image at the element's position
    image(img, elements[i].x, elements[i].y);
    // Update the element's y position based on its speed
    elements[i].y += speed;

    // Remove elements that go off the bottom and spawn new ones
    if (elements[i].y > height) {
      elements.splice(i, 1);
      spawnFunction(1);
    }
  }
}
function handleCollisions() {
  handleElementCollisions(img3, gold, collectGold);
  handleElementCollisions(img2, clouds, gameOver); // Updated this line
}

function gameOver() {
  gameState = "gameOver";
}

function handleElementCollisions(img, elements, collisionFunction) {
  for (let i = 0; i < elements.length; i++) {
    // Check if the element is a cloud
    let isCloud = img === img2;

    // Calculate distance between the fairy and the element
    let distance = dist(
      xPosFairy + img1.width / 2,
      500 + img1.height / 2,
      elements[i].x + img.width / 2,
      elements[i].y + img.height / 2
    );

    // If distance is less than the sum of their radii, a collision happened
    if (distance < (img1.width + img.width) / 2) {
      // Start the collision sound only if it's a cloud
      if (isCloud) {
        // Stop the collision sound before starting it again
        collisionSound.stop();
        collisionSound.start();
      }
      // Call the collision function (e.g., resetLevel)
      collisionFunction(i);
    }
  }
}

function displayScore() {
  fill(0);
  textSize(20);
  text("Score: " + score, 20, 30);
}

function displayLevel() {
  fill(0);
  textSize(20);
  text("Level: " + level, 300, 30);
}

function spawnClouds(numClouds) {
  for (let i = 0; i < numClouds; i++) {
    clouds.push({
      x: random(img2.width, width - img2.width),
      y: random(-200, -50),
    });
  }
}

function spawnGold(numGold) {
  for (let i = 0; i < numGold; i++) {
    gold.push({
      x: random(img3.width, width - img3.width),
      y: random(-300, -200),
    });
  }
}

function collectGold(index) {
  gold.splice(index, 1);
  spawnGold(1);
  score++;

  if (score > 0 && score % 5 === 0) {
    cloudSpeed += 0.5;
    level++;

    levelupSound.start();
  }
  goldSound.start();
}

function resetLevel() {
  xPosFairy = width / 2;
  xSpeedFairy = 0;
  clouds = [];
  gold = [];
  spawnClouds(2);
  spawnGold(1);
  resetScore();
  cloudSpeed = 4;
  level = 1;
}

function resetScore() {
  score = 0;
}