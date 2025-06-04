const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerImg = new Image();
playerImg.src = "oro_character.png";

let backgroundImg = new Image();
backgroundImg.src = "background.jpg";

let groundImg = new Image();
groundImg.src = "ground.png";

let player;
let gravity = 1.1;
let obstacles = [];
let frames = 0;
let score = 0;
let gameOver = false;
let groundX = 0;
let speed = 4;
let difficultyCounter = 0;
let lastObstacleFrame = 0;
const minObstacleSpacing = 140;

function resetGame() {
  player = { x: 60, y: 455, width: 80, height: 80, vy: 0, jumping: false };
  gravity = 1.1;
  obstacles = [];
  frames = 0;
  score = 0;
  gameOver = false;
  groundX = 0;
  speed = 4;
  difficultyCounter = 0;
  lastObstacleFrame = -minObstacleSpacing;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.vy = -30;
    player.jumping = true;
  }
});

document.addEventListener("touchstart", () => {
  if (!player.jumping) {
    player.vy = -30;
    player.jumping = true;
  }
});

function draw() {
  if (gameOver) return;
  frames++;
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  groundX -= speed;
  if (groundX <= -canvas.width) groundX = 0;
  ctx.drawImage(groundImg, groundX, 515, canvas.width, 60);
  ctx.drawImage(groundImg, groundX + canvas.width, 515, canvas.width, 60);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  player.y += player.vy;
  player.vy += gravity;
  if (player.y >= 455) {
    player.y = 455;
    player.vy = 0;
    player.jumping = false;
  }

  // Перешкоди з мінімальним інтервалом
  if (frames - lastObstacleFrame > minObstacleSpacing) {
    const chance = Math.random();
    if (chance > 0.4) {
      const height = 40 + Math.floor(Math.random() * 30);
      obstacles.push({ x: canvas.width, y: 495 + (60 - height), width: 20, height: height });
      lastObstacleFrame = frames;
      difficultyCounter++;
      if (difficultyCounter % 10 === 0 && speed < 12) {
        speed += 0.5;
      }
    }
  }

  obstacles.forEach(ob => {
    ob.x -= speed;
    ctx.fillStyle = "#6B1AFF";
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });
  obstacles = obstacles.filter(ob => ob.x > 0);

  for (let ob of obstacles) {
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      let total = parseInt(localStorage.getItem('oroTotalScore') || '0');
      total += score;
      localStorage.setItem('oroTotalScore', total);
      gameOver = true;
      document.getElementById("finalScoreText").textContent = "Your score: " + score;
      document.getElementById("gameOverModal").style.display = "block";
      return;
    }
  }

  score++;
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Data Points: " + score, canvas.width - 180, 40);

  requestAnimationFrame(draw);
}