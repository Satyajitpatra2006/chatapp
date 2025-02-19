const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = new Map(); // To track connected users by socket ID

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle user joining with their name
  socket.on("join", (username) => {
    users.set(socket.id, username); // Save the username with the socket ID
    console.log(`${username} joined the chat`);
    // Broadcast to others that the user joined
    socket.broadcast.emit("userJoined", `${username} has joined the chat`);
  });

  // Handle user messages
  socket.on("sendMessage", (message) => {
    const username = users.get(socket.id) || "Anonymous";
    console.log(`${username}: ${message}`);
    // Broadcast the message to others
    socket.broadcast.emit("receiveMessage", { username, message });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const username = users.get(socket.id);
    if (username) {
      console.log(`${username} disconnected`);
      users.delete(socket.id); // Remove the user from the map
      socket.broadcast.emit("userDisconnected", `${username} has left the chat`);
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});