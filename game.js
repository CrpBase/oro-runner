function startGame() {
  document.getElementById('menu').style.display = 'none';
  document.querySelector('canvas').style.display = 'block';
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerImg = new Image();
playerImg.src = "oro_character.png";

let player = { x: 60, y: 475, width: 40, height: 40, vy: 0, jumping: false };
let gravity = 1.5;
let obstacles = [];
let frames = 0;
let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.vy = -20;
    player.jumping = true;
  }
});

function draw() {
  if (gameOver) return;
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // Move player
  player.y += player.vy;
  player.vy += gravity;
  if (player.y >= 475) {
    player.y = 475;
    player.vy = 0;
    player.jumping = false;
  }

  // Generate obstacles
  if (frames % 100 === 0) {
    obstacles.push({ x: 1024, y: 495, width: 20, height: 40 });
  }

  // Move obstacles
  obstacles.forEach(ob => {
    ob.x -= 8;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });

  // Remove off-screen
  obstacles = obstacles.filter(ob => ob.x > 0);

  // Collision
  for (let ob of obstacles) {
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      gameOver = true;
      alert("Game Over. Data Points: " + score);
      return;
    }
  }

  // Score
  score++;
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Data Points: " + score, 850, 40);

  requestAnimationFrame(draw);
}

draw();