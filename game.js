const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerImg = new Image();
playerImg.src = "oro_character.png";

let groundImg = new Image();
groundImg.src = "ground.png";

let player;
let gravity = 1.5;
let obstacles = [];
let frames = 0;
let score = 0;
let gameOver = false;
let groundX = 0;
let speed = 4;
let difficultyCounter = 0;

function resetGame() {
  player = { x: 60, y: 455, width: 120, height: 120, vy: 0, jumping: false };
  gravity = 1.5;
  obstacles = [];
  frames = 0;
  score = 0;
  gameOver = false;
  groundX = 0;
  speed = 4;
  difficultyCounter = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.vy = -18;
    player.x += 7;
    player.jumping = true;
  }
});

document.addEventListener("touchstart", () => {
  if (!player.jumping) {
    player.vy = -18;
    player.x += 7;
    player.jumping = true;
  }
});

function draw() {
  if (gameOver) return;
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  if (frames % 180 === 0) {
    obstacles.push({ x: 1024, y: 495, width: 20, height: 60 });
    difficultyCounter++;
    if (difficultyCounter > 0 && difficultyCounter % 10 === 0 && speed < 12) {
      console.log("Increasing speed to", speed + 0.5);
      speed += 0.5;
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
  ctx.fillText("Data Points: " + score, 850, 40);

  requestAnimationFrame(draw);
}
