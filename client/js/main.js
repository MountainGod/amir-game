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
		
		document.getElementById("currentPlayer").innerText = `you are ${data.color === "R" ? "red" : "yellow"}`;
	}
	else {
		socket.disconnect();
		
		document.getElementById("currentPlayer").innerText = "You cannot play right now.";
	}
});

socket.on("move", (move) => {
	if (move.color !== myColor) {
		setPiece(move.position, move.color);
	}
});

socket.on("reset", (data) => {
	resetGame();
});

socket.on("winner", (whoWon) => {
	let winnerTitle = document.getElementById("winner");
	if (whoWon === redPlayer) {
		winnerTitle.innerText = "Red Wins";
	}
	else {
		winnerTitle.innerText = "Yellow Wins";
	}
	winner     = whoWon;
	isGameOver = true;
});

function sendMove(position) {
	socket.emit("move", {
		position: position,
		player:   myColor,
	});
}

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
	if (myColor === currentTurnPlayer) {
		setPiece(this.id, myColor);
		sendMove(this.id);
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
	board[row][col] = color;
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

document.getElementById("resetBtn")
        .addEventListener("click", () => {
	        socket.emit("reset", {
		        player: myColor,
	        });
	
	        resetGame();
        });
