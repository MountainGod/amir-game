const express  = require("express");
const http     = require("http");
const {Server} = require("socket.io");

const port = 80;

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

app.use(express.static(__dirname + "/client"));

const redPlayer       = "R";
const yellowPlayer    = "Y";
let currentTurnPlayer = redPlayer;

let currentCols;
let winner     = null;
let isGameOver = false;

let board;
const ROWS = 6;
const COLS = 7;

let players = {
	red:    null,
	yellow: null,
};

function setGame() {
	board       = [];
	currentCols = [5, 5, 5, 5, 5, 5, 5];
	
	for (let i = 0; i < ROWS; i++) {
		let row = [];
		for (let j = 0; j < COLS; j++) {
			row.push(" ");
		}
		board.push(row);
	}
}

function setPiece(position, color) {
	if (isGameOver) {
		return;
	}
	let col = parseInt(position.split("")[1]);
	let row = currentCols[col];
	if (row < 0) {
		return;
	}
	
	if (currentTurnPlayer === redPlayer) {
		currentTurnPlayer = yellowPlayer;
	}
	else {
		currentTurnPlayer = redPlayer;
	}
	
	board[row][col]  = color;
	row -= 1;
	currentCols[col] = row;
	
	checkWinner();
}

function checkWinner() {
	for (let i = 0; i < ROWS; i++) {
		for (let j = 0; j < COLS - 3; j++) {
			if (board[i][j] !== " ") {
				if (board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3]) {
					setWinner(i, j);
					return;
				}
			}
		}
	}
	
	for (let j = 0; j < COLS; j++) {
		for (let i = 0; i < ROWS - 3; i++) {
			if (board[i][j] !== " ") {
				if (board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j]) {
					setWinner(i, j);
					return;
				}
			}
		}
	}
	
	for (let i = 0; i < ROWS - 3; i++) {
		for (let j = 0; j < COLS - 3; j++) {
			if (board[i][j] !== " ") {
				if (board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3]) {
					setWinner(i, j);
					return;
				}
			}
		}
	}
	
	for (let i = 3; i < ROWS; i++) {
		for (let j = 0; j < COLS - 3; j++) {
			if (board[i][j] !== " ") {
				if (board[i][j] === board[i - 1][j + 1] && board[i][j] === board[i - 2][j + 2] && board[i][j] === board[i - 3][j + 3]) {
					setWinner(i, j);
					return;
				}
			}
		}
	}
}

function setWinner(i, j) {
	winner     = board[i][j];
	isGameOver = true;
	
	io.emit("winner", winner);
}

function resetGame() {
	isGameOver        = false;
	currentTurnPlayer = winner ?? redPlayer;
	currentCols       = null;
	board             = null;
	
	setGame();
}

io.on("connection", (socket) => {
	console.log(`a user connected with id ${socket.id}`);
	let data = {};
	
	if (players.red !== null && players.yellow !== null) {
		console.log(`${socket.id} can't connect: too many players`);
		data.valid = false;
	}
	else {
		if (players.red === null) {
			players.red = socket.id;
			data.color  = redPlayer;
		}
		else {
			players.yellow = socket.id;
			data.color     = yellowPlayer;
		}
		data.valid = true;
	}
	
	socket.emit("details", data);
	
	socket.on("move", (move) => {
		socket.broadcast.emit("move", move);
		setPiece(move.position, move.player);
	});
	
	socket.on("reset", (data) => {
		socket.broadcast.emit("reset", data);
		resetGame();
	});
	
	socket.on("disconnect", () => {
		if (data.valid) {
			if (data.color === redPlayer) {
				players.red = null;
			}
			else {
				players.yellow = null;
			}
		}
		console.log(`user with id ${socket.id} disconnected`);
	});
});

server.listen(port, () => {
	console.log(`listening on *:${port}`);
});

setGame();
