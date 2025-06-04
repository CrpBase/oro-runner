const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 240, width: 40, height: 40, vy: 0, jumping: false };
let gravity = 1.2;
let obstacles = [];
let frames = 0;
let score = 0;
let gameOver = false;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.vy = -18;
    player.jumping = true;
  }
});

function draw() {
  if (gameOver) return;
  frames++;
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player
  ctx.fillStyle = "#009393";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Move player
  player.y += player.vy;
  player.vy += gravity;
  if (player.y >= 240) {
    player.y = 240;
    player.vy = 0;
    player.jumping = false;
  }

  // Generate obstacles
  if (frames % 100 === 0) {
    obstacles.push({ x: 800, y: 250, width: 20, height: 40 });
  }

  // Move obstacles
  obstacles.forEach(ob => {
    ob.x -= 6;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter(ob => ob.x > 0);

  // Collision detection
  for (let ob of obstacles) {
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      gameOver = true;
      alert("Game Over. Data Points Collected: " + score);
      return;
    }
  }

  // Score
  score++;
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText("Data Points: " + score, 600, 30);

  requestAnimationFrame(draw);
}

draw();