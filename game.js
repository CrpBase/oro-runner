const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player, gravity, obstacles, score, gameOver, speed, frames, groundx, totalScore = 0;
let groundImage = new Image();
groundImage.src = 'ground.png';
let backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

const treeSingle = new Image();
treeSingle.src = "tree_single.png";
const treeDouble = new Image();
treeDouble.src = "tree_double.png";
const pterodactyl = new Image();
pterodactyl.src = "pterodactyl1.png";

const oro = new Image();
oro.src = "oro_character.png";

function resetGame() {
  player = { x: 50, y: 465, width: 100, height: 100, vy: 0, jumping: false };
  gravity = 1.3;
  obstacles = [];
  frames = 0;
  score = 0;
  gameOver = false;
  speed = 4;
  groundx = 0;
}

function startGame() {
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("scorePopup").style.display = "none";
  resetGame();
  requestAnimationFrame(update);
}

function closePopup() {
  document.getElementById("scorePopup").style.display = "none";
  document.getElementById("mainMenu").style.display = "block";
  document.getElementById("totalScore").innerText = "Total Points: " + totalScore;
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // ground
  groundx -= speed;
  if (groundx <= -canvas.width) groundx = 0;
  ctx.drawImage(groundImage, groundx, canvas.height - 30, canvas.width, 30);
  ctx.drawImage(groundImage, groundx + canvas.width, canvas.height - 30, canvas.width, 30);

  // player
  player.y += player.vy;
  player.vy += gravity;
  if (player.y >= 465) {
    player.y = 465;
    player.vy = 0;
    player.jumping = false;
  }
  ctx.drawImage(oro, player.x, player.y, player.width, player.height);

  // obstacles
  if (frames % 70 === 0) {
    let rand = Math.random();
    if (rand < 0.06) {
      obstacles.push({ x: canvas.width, y: 300, width: 120, height: 60, type: 'fly', img: pterodactyl });
    } else if (rand < 0.5) {
      obstacles.push({ x: canvas.width, y: 465, width: 70, height: 100, type: 'tree_single', img: treeSingle });
    } else {
      obstacles.push({ x: canvas.width, y: 465, width: 100, height: 100, type: 'tree_double', img: treeDouble });
    }
  }

  obstacles.forEach((ob, index) => {
    ob.x -= speed;
    ctx.drawImage(ob.img, ob.x, ob.y, ob.width, ob.height);
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      if (ob.type === "fly" && player.y > 400) return;
      gameOver = true;
      totalScore += score;
      document.getElementById("finalScore").innerText = "Your score: " + score;
      document.getElementById("scorePopup").style.display = "block";
    }
  });

  // score
  score++;
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Data Points: " + score, 800, 30);

  // speed increase
  if (score % 100 === 0) {
    speed += 0.5;
  }

  frames++;
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.vy = -16;
    player.jumping = true;
  }
});

document.addEventListener("touchstart", () => {
  if (!player.jumping) {
    player.vy = -16;
    player.jumping = true;
  }
});
