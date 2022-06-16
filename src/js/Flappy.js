gameContainer.style.width = `${GAME_CONTAINER_WIDTH}px`;
gameContainer.style.height = `${GAME_CONTAINER_HEIGHT}px`;

let score = 0;
let indexPipe = 0;

//left margin for pipes
const pipePosArray = [];
for (let i = 1; i <= PIPE_COUNT; i++) {
    pipePosArray.push((GAME_CONTAINER_WIDTH / PIPE_COUNT) * i);
}
//sound effects
const soundDead = new Audio("./assets/sounds/dead.wav");
const soundFlap = new Audio("./assets/sounds/flap.wav");
const soundPoint = new Audio("./assets/sounds/point.wav");

//  Press spacebar to control the bird:
const handleKey = (e) => {
    let code = e.code;

    if (code == "Space") {
        birdVelocity = 0;
        time = 0;
        birdVelocity = -(2 * INITIAL_VELOCITY);
        soundFlap.play();
    }
};

// main gameplay on the screen
const startGame = () => {
    let bird_elem = document.querySelector(".bird");

    if (gameStart) {
        document.addEventListener("keydown", handleKey);

        moveBird();
        movePipe(bird_elem);
        time += 0.001;

        if (score > highScoreFlappy) {
            scoreContainer.innerText = `${score}`;
            highScoreFlappy = score;
        }

        scoreContainer.innerText = `${score}`;
        window.requestAnimationFrame(startGame);
    }
};

// on game over:

const gameOver = () => {
    soundDead.play();

    time = 0;
    onDeath();
    gameStart = false;
    birdVelocity = INITIAL_VELOCITY;
    startBtn.classList.remove("hideMe");
    document.removeEventListener("keydown", handleKey);
    localStorage.setItem("highestScore", highScoreFlappy);
    startBtn.innerHTML = `<p>Your Score : ${score} </p><p>Restart</p> <p>High Score : ${highScoreFlappy} </p><img src="assets/images/startButton.png" alt="play">
  `;
};

// click on Start button to start the game:

startBtn.addEventListener("click", () => {
    checkHighscore();

    score = 0;
    time = INITIAL_TIME;
    gameStart = true;
    gameSpeed = INITIAL_GAME_SPEED;
    birdVelocity = INITIAL_VELOCITY;
    gameContainer.innerHTML = "";
    startBtn.classList.add("hideMe");
    gameContainer.classList.remove("hideMe");

    createPipe();
    createBird();
    window.requestAnimationFrame(startGame);
});

//For Bird:

const createBird = () => {
    const bird_elem = document.createElement("div");

    bird_elem.posY = INITIAL_POSITION_Y;
    bird_elem.posX = INITIAL_POSTION_X;

    bird_elem.style.top = `${bird_elem.posY}px`;
    bird_elem.style.left = `${bird_elem.posX}px`;
    bird_elem.setAttribute("class", "bird");
    bird_elem.style.width = `${BIRD_WIDTH}px`;
    bird_elem.style.height = `${BIRD_HEIGHT}px`;

    gameContainer.appendChild(bird_elem);
};

const moveBird = () => {
    const bird_elem = document.querySelector(".bird");

    // v = u + g*t
    birdVelocity += DOWNWARD_GRAVITY * time;
    bird_elem.posY += birdVelocity;
    bird_elem.style.top = `${bird_elem.posY}px`;

    //rotate the bird as per its moving direction
    if (birdVelocity > 0) {
        bird_elem.style.transform = `rotate(${birdVelocity * 2.5}deg)`;
    } else {
        bird_elem.style.transform = `rotate(${birdVelocity * 5}deg)`;
    }

    if (checkWallCollision(bird_elem)) {
        gameOver();
    }
    bird_elem.style.backgroundImage = `url('./assets/images/bird.png')`;
    bird_elem.style.backgroundRepeat = "no-repeat";
    bird_elem.style.backgroundRepeat = "100% 100%";
    bird_elem.style.width = `${BIRD_WIDTH}px`;
    bird_elem.style.height = `${BIRD_HEIGHT}px`;
};

const onDeath = () => {
    const bird = document.querySelector(".bird");
    bird.style.transform = "rotate(90deg)";

    let deathFrame = window.requestAnimationFrame(onDeath);

    if (bird.posY >= GAME_CONTAINER_HEIGHT - BIRD_HEIGHT) {
        cancelAnimationFrame(deathFrame);
        return;
    }

    bird.posY += 20;
    bird.posY = Math.min(bird.posY, GAME_CONTAINER_HEIGHT - BIRD_HEIGHT);
    bird.style.top = `${bird.posY}px`;
}; //bird size and inital position:

// For the Pipe:

const createPipe = () => {
    for (let count = 0; count < PIPE_COUNT; count++) {
        const pipe_length = getRandomInt(150, MAXIMUM_PIPE_HEIGHT * 0.92);

        drawPipe(pipe_length, "top");
        drawPipe(MAXIMUM_PIPE_HEIGHT - pipe_length, "bottom");

        indexPipe = (indexPipe + 1) % pipePosArray.length;
    }
};

const drawPipe = (length, position) => {
    const pipe = document.createElement("div");

    if (position === "top") {
        pipe.style.top = `0px`;
        pipe.setAttribute("class", "pipe pipeUp");
    }

    if (position === "bottom") {
        pipe.style.bottom = `0px`;
        pipe.setAttribute("class", "pipe pipeDown");
    }

    pipe.x = pipePosArray[indexPipe];
    pipe.style.width = `${PIPE_WIDTH}px`;
    pipe.style.height = `${length}px`;
    pipe.style.left = `${pipe.x}px`;
    gameContainer.appendChild(pipe);
};

const movePipe = (bird) => {
    const pipeList = document.querySelectorAll(".pipe");

    pipeList.forEach((pipe) => {
        if (checkCollision(pipe, bird)) {
            gameOver();
        }

        if (pipe.x < -1 * (PIPE_WIDTH - 1)) {
            pipe.x = GAME_CONTAINER_WIDTH - (PIPE_WIDTH - 1);
            score += 0.5;
            soundPoint.play();
        }

        pipe.x -= INITIAL_GAME_SPEED;
        pipe.style.left = `${pipe.x}px`;
    });
};

// For Collisions and HighSccores:

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min) + min);
};

const checkHighscore = () => {
    try {
        highScoreFlappy = localStorage.getItem("highestScore");
    } catch (err) {
        localStorage.setItem("highestScoreFlappy", 0);
    } finally {
        if (highScoreFlappy == null) highScoreFlappy = 0;
    }
};

const checkCollision = (element1, element2) => {
    birdRect = element1.getBoundingClientRect();
    pipeRect = element2.getBoundingClientRect();

    return !(
        birdRect.top > pipeRect.bottom ||
        birdRect.bottom < pipeRect.top ||
        birdRect.right < pipeRect.left ||
        birdRect.left > pipeRect.right
    );
};

const checkWallCollision = (item) => {
    const y = item.posY;

    if (y <= 0 || y + BIRD_HEIGHT >= GAME_CONTAINER_HEIGHT) {
        return true;
    }

    return false;
};
