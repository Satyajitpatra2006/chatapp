const socket = io();

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// Prompt user for their name when they join
let username = prompt("Enter your name:");
if (!username) username = "Someone";
 username = username.toUpperCase()
// Notify the server that a user has joined
socket.emit("join", username);

// Add a new message to the chat box
function addMessage(message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", type);
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Send a message
sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    addMessage(`${message}`, "user"); // Add user's message
    socket.emit("sendMessage", message); // Send to server
    messageInput.value = "";
  }
});

// Handle messages from other users
socket.on("receiveMessage", ({ username, message }) => {
  addMessage(`${username}: ${message}`, "bot"); // Add to the left side
});

// Handle "user joined" messages
socket.on("userJoined", (message) => {
  addMessage(message, "info"); // Add join info
});

// Handle "user disconnected" messages
socket.on("userDisconnected", (message) => {
  addMessage(message, "info"); // Add disconnect info
});