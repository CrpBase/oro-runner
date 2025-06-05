
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const music = new Audio("music.mp3");
const bangSound = new Audio("bang.mp3");
bangSound.volume = 1.0;
music.loop = true;
music.volume = 0.5;

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
let player, obstacles, frames, score, gameOver, groundx, speed, gravity, difficultyCounter;

function resetGame() {
    player = { x: 60, y: 465, width: 120, height: 120, vy: 0, jumping: false };
    gravity = 0.60;
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

    

if (frames % 140 === 0 && !skipNextSpawn) {
        const clusterChance = Math.random();
        if (clusterChance < 0.3 && speed <= 6) {
            const count = 2;
            for (let j = 0; j < count; j++) {
                const spacing = 300;
                obstacles.push({
                    x: canvas.width + j * spacing,
                    y: canvas.height - 64 - 100,
                    width: 60,
                    height: 100,
                    type: "cluster"
                });
            }
        } else {

        const clusterChance = Math.random();
        if (clusterChance < 0.3 && speed <= 6) {
            const count = 2;
            for (let j = 0; j < count; j++) {
                const spacing = 300;
                obstacles.push({
                    x: canvas.width + j * spacing,
                    y: canvas.height - 64 - 100,
                    width: 60,
                    height: 100,
                    type: "cluster"
                });
            }
        } else {

        const type = Math.random() < 0.3 ? "double" : "single";
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 64 - 100,
            width: 60,
            height: 100,
            type
        });
        difficultyCounter++;
        }
        if (difficultyCounter % 10 === 0) {
            speed += 1.0;
            gravity += 0.03;
        }
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= speed;
        const img = obstacles[i].type === "double" ? treeDoubleImage : treeSingleImage;
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
bangSound.play().catch(e => console.warn("Bang blocked"));
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

window.startGame = function startGame() {
    document.getElementById("menu").style.display = "none";
    canvas.style.display = "block";
    document.getElementById("gameOverModal").style.display = "none";
    music.play().catch(e => console.warn("Autoplay blocked:", e));
    resetGame();
    speed = 4;
    gravity = 0.60;
    difficultyCounter = 0;
    skipNextSpawn = false;
    draw();
}

window.backToMenu = function backToMenu() {
    document.getElementById("menu").style.display = "flex";
    canvas.style.display = "none";
    document.getElementById("gameOverModal").style.display = "none";
}
