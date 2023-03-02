
const RedPlayer      ="R";
const YellowPlayer = "Y";
let CurrentPlayer = RedPlayer;
let CurrentCols;
let GameOver=false;
let board;
const rows=6;
const cols=7;
let button=document.getElementById("button");

window.onload=function(){
	setGame();
}
function setGame(){
	board=[];
	CurrentCols=[5, 5, 5, 5, 5, 5, 5];
	
	for (let i = 0; i <rows ; i++) {
		let row=[];
		for (let j = 0; j < cols; j++) {
			row.push(' ');
			let piece=document.createElement("div");
			piece.id = i.toString() + "-" +j.toString();
			piece.classList.add("piece");
			piece.addEventListener("click",setPiece);
			document.getElementById("board").append(piece);
			
			
		}
		board.push(row);
		
	}
	
}
function setPiece(){
	
	if(GameOver){
		return;
	}
	let position=this.id.split("-");
	let r = parseInt(position[0]);
	let c = parseInt(position[1]);
	r=CurrentCols[c];
	if(r<0){
		return;
	}
	board[r][c]=CurrentPlayer;
	let piece=document.getElementById(r.toString()+"-"+c.toString());
	if(CurrentPlayer==RedPlayer){
		piece.classList.add("red")
		CurrentPlayer=YellowPlayer;
	}
	else{
		piece.classList.add("yellow")
		CurrentPlayer=RedPlayer;
	}
	r-=1;
	CurrentCols[c]=r;
	
	checkWinner();
	
}

function checkWinner(){
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols-3; j++) {
			if (board[i][j]!=" ") {
				if (board[i][j] == board[i][j + 1] && board[i][j] == board[i][j + 2] && board[i][j] == board[i][j + 3]) {
					setWinner(i, j);
					return;
				}
			}
		}
		
	}
	for (let j = 0; j < cols; j++) {
		for (let i = 0; i < rows-3; i++) {
			if (board[i][j]!=" ") {
				if (board[i][j] == board[i+1][j] && board[i][j] == board[i+2][j] && board[i][j] == board[i+3][j]) {
					setWinner(i, j);
					return;
				}
			}
		}
		
	}
	
	for (let i = 0; i < rows-3; i++) {
		for (let j = 0; j < cols-3; j++) {
			if (board[i][j]!=" ") {
				if (board[i][j] == board[i+1][j+1] && board[i][j] == board[i+2][j+2] && board[i][j] == board[i+3][j+3]) {
					setWinner(i, j);
					return;
				}
			}
		}
		
	}
	for (let i = 3; i < rows; i++) {
		for (let j = 0; j < cols-3; j++) {
			if (board[i][j]!=" ") {
				if (board[i][j] == board[i-1][j+1] && board[i][j] == board[i-2][j+2] && board[i][j] == board[i-3][j+3]) {
					setWinner(i, j);
					return;
				}
			}
		}
		
	}
	
	
}
function setWinner(i,j){
	let winner=document.getElementById("winner");
	if(board[i][j]==RedPlayer){
		winner.innerText="Red Wins";
	}
	else{
		winner.innerText="Yellow Wins";
	}
	GameOver=true;
	return;
}

function resetGame(){
	GameOver=false;
	setGame();
}