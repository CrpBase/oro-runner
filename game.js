
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "background.png";

const groundImage = new Image();
groundImage.src = "ground.png";

const playerImage = new Image();
playerImage.src = "oro_character.png";

const treeSingleImage = new Image();
treeSingleImage.src = "tree_single.png";

const treeDoubleImage = new Image();
treeDoubleImage.src = "tree_double.png";

let totalPoints = parseInt(localStorage.getItem("oroTotalScore") || "0");
let player, obstacles, frames, score, gameOver, groundx, speed, difficultyCounter;

function resetGame() {
    player = { x: 60, y: 465, width: 120, height: 120, vy: 0, jumping: false };
    gravity = 0.65;
    obstacles = [];
    frames = 0;
    score = 0;
    gameOver = false;
    groundx = 0;
    speed = 4;
    difficultyCounter = 0;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.vy = -18;
        player.jumping = true;
    }
});

document.addEventListener("touchstart", () => {
    if (!player.jumping) {
        player.vy = -18;
        player.jumping = true;
    }
});

function draw() {
    if (gameOver) return;

    frames++;
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    groundx -= speed;
    if (groundx <= -canvas.width) groundx = 0;
    ctx.drawImage(groundImage, groundx, canvas.height - 64, canvas.width, 64);
    ctx.drawImage(groundImage, groundx + canvas.width, canvas.height - 64, canvas.width, 64);

    player.y += player.vy;
    player.vy += gravity;
    if (player.y > canvas.height - 64 - player.height) {
        player.y = canvas.height - 64 - player.height;
        player.vy = 0;
        player.jumping = false;
    }
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    if (frames % 140 === 0) {
        const type = Math.random() < 0.3 ? "double" : "single";
        obstacles.push({ x: canvas.width, y: canvas.height - 64 - 100, width: 60, height: 100, type });
        difficultyCounter++;
        if (difficultyCounter % 10 === 0) speed += 1.0;
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        const img = obstacles[i].type === "double" ? treeDoubleImage : treeSingleImage;
        ctx.drawImage(img, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        let offsetY = (obstacles[i].type === "single" || obstacles[i].type === "double") ? 50 : 0;
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y + offsetY
        ) {
            gameOver = true;
            totalPoints += score;
            localStorage.setItem("oroTotalScore", totalPoints);
            document.getElementById("totalScore").textContent = totalPoints;
            showGameOver(score);
        }
    }

    obstacles = obstacles.filter((o) => o.x + o.width > 0);
    score++;
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Data Points: " + score, canvas.width - 200, 30);

    if (!gameOver) requestAnimationFrame(draw);
}

function showGameOver(currentScore) {
    const modal = document.getElementById("gameOverModal");
    const scoreText = document.getElementById("finalScoreText");
    scoreText.textContent = "Your score: " + currentScore;
    modal.style.display = "flex";
}
