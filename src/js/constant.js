//Div Elements from DOM:
const gameContainer = document.querySelector(".game-wrapper");
const scoreContainer = document.querySelector(".scoreWrapper");
const startBtn = document.querySelector(".startBtn");
const container = document.querySelector(".gameContainer");

//Size of the game container:
const GAME_CONTAINER_HEIGHT = 600;
const GAME_CONTAINER_WIDTH = 1000;

//no. of pipe on the screen and the space size between them:
const PIPE_COUNT = 3;
const PIPE_SPACE = 200;
const PIPE_WIDTH = 45;
const MAXIMUM_PIPE_HEIGHT = GAME_CONTAINER_HEIGHT - PIPE_SPACE;

//bird size and inital position:
const BIRD_WIDTH = 43;
const BIRD_HEIGHT = 30;
const INITIAL_POSTION_X = 48;
const INITIAL_POSITION_Y = 150;

//Factors for affecting the birds positions:
const INITIAL_TIME = 0;
const INITIAL_VELOCITY = 2.2;
const DOWNWARD_GRAVITY = 9.8;
const INITIAL_GAME_SPEED = 2.4;
const SPEED_FACTOR = 0.003;
