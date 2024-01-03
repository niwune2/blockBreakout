const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;

let ballSpeed = 5;
let dx = ballSpeed;;
let dy = -ballSpeed;

const paddleHeight = 10,
    paddleWidth = 100;
let paddleX = (width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickColumnCount = 10, // number of column
    brickRowCount = 5, // number of rows
    brickWidth = 75,
    brickHeight = 20,
    brickPadding = 10,
    brickOffsetTop = 30,
    brickOffsetLeft = 30;

let score = 0;
let lives = 3;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('keydown', (e) => {
    const key = e.key;
    switch (key) {
        case 'Right':
        case 'ArrowRight':
        case 'd': rightPressed = true;
            break;
        case 'Left':
        case 'ArrowLeft':
        case 'a': leftPressed = true;
            break;
        default: return;
    }
}, false);

document.addEventListener('keyup', (e) => {
    const key = e.key;
    switch (key) {
        case 'Right':
        case 'ArrowRight':
        case 'd': rightPressed = false;
            break;
        case 'Left':
        case 'ArrowLeft':
        case 'a': leftPressed = false;
            break;
        default: return;
    }
}, false);

document.addEventListener('mousemove', (e) => {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}, false);

let bricks = [];
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (let j = 0; j < brickColumnCount; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

function drawBall() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 200, 250, 0.8)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "rgb(100,100,255)";
    ctx.shadowColor = "white";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColumnCount; j++) {
            if (bricks[i][j].status === 1) {
                const brickX = i * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = j * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for (let i = 0; i < brickRowCount; i++) {
        for (let j = 0; j < brickColumnCount; j++) {
            const b = bricks[i][j];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score === brickColumnCount * brickRowCount) {
                        alert("You Win, Congratulations!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    drawBricks();
    drawBall();
    ctx.shadowColor = "transparent";
    drawPaddle();
    drawScore();
    drawLives();
    ctx.shadowColor = "white";
    collisionDetection();

    if (x + dx > width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert('Game Over');
                document.location.reload();
            } else {
                x = width / 2;
                y = height -30;
                dx = ballSpeed;
                dy = -ballSpeed;
                paddleX = (width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && paddleX < width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();