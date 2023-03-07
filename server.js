const express  = require("express");
const http     = require("http");
const {Server} = require("socket.io");

const port = 80;

const app    = express();
const server = http.createServer(app);
const io     = new Server(server);

app.use(express.static(__dirname + "/client"));

players = [];

function handleMove(data) {
	console.log(`move by ${data.player}: ${data.move}`);
}

io.on("connection", (socket) => {
	console.log(`a user connected with id ${socket.id}`);
	let data = {};
	
	if (players.length >= 2) {
		console.log(`${socket.id} can't connect: too many players`);
		data.valid = false;
	}
	else {
		players.push(socket.id);
		data.valid = true;
		data.color = players.indexOf(socket.id) === 0 ? "R" : "Y";
	}
	
	socket.emit("details", data);
	
	socket.on("move", handleMove);
	
	socket.on("disconnect", () => {
		if (data.valid) {
			players.splice(players.indexOf(socket.id), 1);
		}
		console.log(`user with id ${socket.id} disconnected`);
	});
});

server.listen(port, () => {
	console.log(`listening on *:${port}`);
});

