
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

const pterodactylImage = new Image();
pterodactylImage.src = "pterodactyl.png";

let totalPoints = 0;
let player, obstacles, frames, score, gameOver, groundx, speed, difficultyCounter;

function resetGame() {
    player = { x: 60, y: 465, width: 120, height: 120, vy: 0, jumping: false };
    gravity = 1.5;
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
        player.vy = -20;
        player.jumping = true;
    }
});

document.addEventListener("touchstart", () => {
    if (!player.jumping) {
        player.vy = -20;
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

    if (frames % 90 === 0) {
        const rand = Math.random();
        let type = "single";
        if (rand < 0.25) type = "double";
        else if (rand < 0.4) type = "pterodactyl";

        let y = (type === "pterodactyl") ? 150 : canvas.height - 64 - 180;
        let height = (type === "pterodactyl") ? 72 : 180;

        obstacles.push({ x: canvas.width, y, width: 90, height, type });
        difficultyCounter++;
        if (difficultyCounter % 10 === 0) speed += 0.5;
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        let img;
        switch (obstacles[i].type) {
            case "double": img = treeDoubleImage; break;
            case "pterodactyl": img = pterodactylImage; break;
            default: img = treeSingleImage;
        }
        ctx.drawImage(img, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        if (
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y
        ) {
            gameOver = true;
            totalPoints += score;
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
    const scoreText = document.getElementById("scoreText");
    scoreText.textContent = "Your score: " + currentScore;
    modal.style.display = "flex";
}

function startGame() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    document.getElementById("gameOverModal").style.display = "none";
    resetGame();
    draw();
}

function backToMenu() {
    document.getElementById("menu").style.display = "flex";
    document.getElementById("gameCanvas").style.display = "none";
}

document.getElementById("startBtn").onclick = startGame;
document.getElementById("shopBtn").onclick = () => alert("Shop coming soon!");
document.getElementById("linkBtn").onclick = () => window.open("https://linktr.ee/oro_xyz", "_blank");
document.getElementById("okBtn").onclick = backToMenu;

document.getElementById("totalPoints").textContent = totalPoints;
