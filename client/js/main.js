const redPlayer    = "R";
const yellowPlayer = "Y";
let currentPlayer  = redPlayer;

let currentCols;
let gameOver = false;

let board;
const ROWS = 6;
const COLS = 7;

window.onload = setGame;

function setGame() {
	board       = [];
	currentCols = [5, 5, 5, 5, 5, 5, 5];
	
	for (let i = 0; i < ROWS; i++) {
		let row = [];
		for (let j = 0; j < COLS; j++) {
			row.push(" ");
			let piece = document.createElement("div");
			piece.id  = i.toString() + "-" + j.toString();
			piece.classList.add("piece");
			piece.addEventListener("click", setPiece);
			document.getElementById("board").append(piece);
			
			
		}
		board.push(row);
	}
}

function setPiece() {
	if (gameOver) {
		return;
	}
	let position = this.id.split("-");
	let col      = parseInt(position[1]);
	let row      = currentCols[col];
	if (row < 0) {
		return;
	}
	board[row][col] = currentPlayer;
	let piece       = document.getElementById(row.toString() + "-" + col.toString());
	if (currentPlayer === redPlayer) {
		piece.classList.add("red");
		currentPlayer = yellowPlayer;
	}
	else {
		piece.classList.add("yellow");
		currentPlayer = redPlayer;
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
	let winner = document.getElementById("winner");
	if (board[i][j] === redPlayer) {
		winner.innerText = "Red Wins";
	}
	else {
		winner.innerText = "Yellow Wins";
	}
	gameOver = true;
}

function resetGame() {
	gameOver = false;
	setGame();
}