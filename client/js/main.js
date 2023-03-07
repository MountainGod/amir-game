let socket = io();

const redPlayer       = "R";
const yellowPlayer    = "Y";
let currentTurnPlayer = redPlayer;
let myColor           = null;

let currentCols;
let winner     = null;
let isGameOver = false;

let board;
const ROWS = 6;
const COLS = 7;

window.onload = setGame;

socket.on("details", (data) => {
	if (data.valid) {
		myColor = data.color;
	}
	else {
		socket.disconnect();
	}
});

function setGame() {
	board       = [];
	currentCols = [5, 5, 5, 5, 5, 5, 5];
	
	for (let i = 0; i < ROWS; i++) {
		let row = [];
		for (let j = 0; j < COLS; j++) {
			row.push(" ");
			let piece = document.createElement("div");
			piece.id  = i.toString() + j;
			piece.classList.add("piece");
			piece.addEventListener("click", setPieceListener);
			document.getElementById("board").append(piece);
		}
		board.push(row);
	}
}

function setPieceListener() {
	setPiece(this.id);
}


function setPiece(position) {
	if (isGameOver) {
		return;
	}
	position = position.split("");
	let col  = parseInt(position[1]);
	let row  = currentCols[col];
	if (row < 0) {
		return;
	}
	board[row][col] = currentTurnPlayer;
	let piece       = document.getElementById(row.toString() + col);
	if (currentTurnPlayer === redPlayer) {
		piece.classList.add("red");
		currentTurnPlayer = yellowPlayer;
	}
	else {
		piece.classList.add("yellow");
		currentTurnPlayer = redPlayer;
	}
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
	let winnerTitle = document.getElementById("winner");
	if (board[i][j] === redPlayer) {
		winnerTitle.innerText = "Red Wins";
	}
	else {
		winnerTitle.innerText = "Yellow Wins";
	}
	winner     = board[i][j];
	isGameOver = true;
}

function resetGame() {
	isGameOver        = false;
	currentTurnPlayer = winner ?? redPlayer;
	currentCols       = null;
	board             = null;
	
	const lastBoard = document.getElementById("board");
	while (lastBoard.firstChild) {
		lastBoard.removeChild(lastBoard.lastChild);
	}
	
	document.getElementById("winner").innerText = "";
	
	setGame();
}

document.getElementById("resetBtn").addEventListener("click", resetGame);
