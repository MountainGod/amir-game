
const RedPlayer      ="R";
const YellowPlayer = "Y";
let CurrentPlayer = RedPlayer;
let GameOver=false;
let board;
const rows=6;
const cols=7;
window.onload=function(){
	setGame();
}
function setGame(){
	board=[];
	
	for (let i = 0; i <rows ; i++) {
		let row=[];
		for (let j = 0; j < cols; j++) {
			row.push(' ');
			let piece=document.createElement("div");
			piece.id = i.toString() + "-"+j.toString();
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
	board[r][c]=CurrentPlayer;
	let piece=this;
	if(CurrentPlayer==RedPlayer){
		piece.classList.add("red")
		CurrentPlayer=YellowPlayer;
	}
	else{
		piece.classList.add("yellow")
		CurrentPlayer=RedPlayer;
	}
	
	
}