
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const music = new Audio("music.mp3");
music.loop = true;
music.volume = 0.5;

const bangSound = new Audio("bang.mp3");
bangSound.volume = 1.0;

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
let player, obstacles, frames, score, gameOver, groundx, speed, gravity, difficultyCounter, animationId, skipFrameCooldown, framesSinceUpgrade = 0;

function resetGame() {
    player = { x: 60, y: 465, width: 120, height: 120, vy: 0, jumping: false };
    gravity = 0.60;
    speed = 4;
    difficultyCounter = 0;
    framesSinceUpgrade = 0;
    obstacles = [];
    frames = 0;
    score = 0;
    gameOver = false;
    groundx = 0;
}

document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.jumping) {
        player.vy = -19;
        player.jumping = true;
    }
});

document.addEventListener("touchstart", () => {
    if (!player.jumping) {
        player.vy = -19;
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

    if (frames % 140 === 0 && framesSinceUpgrade === 0) {
        const clusterChance = Math.random();
        if (clusterChance < 0.3 && speed <= 6) {
            const count = 2 + Math.floor(Math.random() * Math.min(2, 4 - speed));
            for (let j = 0; j < count; j++) {
                const spacing = 300 + (speed - 4) * 30;
                obstacles.push({
                    x: canvas.width + j * spacing,
                    y: canvas.height - 64 - 100,
                    width: 60,
                    height: 100,
                    type: "cluster"
                });
            }
        } else {
            obstacles.push({
                x: canvas.width,
                y: canvas.height - 64 - 100,
                width: 60,
                height: 100,
                type: "single"
            });
        }
        difficultyCounter++;
        if (difficultyCounter > 0 && difficultyCounter % 10 === 0) {
            speed += 1.0;
            gravity += 0.03;
            framesSinceUpgrade = 15;
        } else {
            framesSinceUpgrade = 0;
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        const img = treeSingleImage;
        ctx.drawImage(img, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y + 50
        ) {
            gameOver = true;
            music.pause();
            music.currentTime = 0;
            bangSound.play().catch(() => {});
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

    if (!gameOver) {
        if (framesSinceUpgrade > 0) framesSinceUpgrade--;
        animationId = requestAnimationFrame(draw);
    }
}

function showGameOver(currentScore) {
    const modal = document.getElementById("gameOverModal");
    const scoreText = document.getElementById("finalScoreText");
    scoreText.textContent = "Your score: " + currentScore;
    modal.style.display = "flex";
}

window.startGame = function startGame() {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("gameOverModal").style.display = "none";
    music.currentTime = 0;
    music.play().catch(() => {});
    resetGame();
    cancelAnimationFrame(animationId);
    draw();
}

window.backToMenu = function backToMenu() {
    document.getElementById("menu").style.display = "flex";
    canvas.style.display = "none";
    document.getElementById("gameOverModal").style.display = "none";
}
