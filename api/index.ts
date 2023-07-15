// Require the modules
import express from "express";
import * as socketio from "socket.io";
import session from "express-session";
import * as uuid from "uuid";
import http from "http";


const app = express();

const sessionMiddleware = session({
  secret: "some secret",
  name: "session_id",
  resave: false,
  saveUninitialized: true,
  genid: () => uuid.v4(), // Generate a unique id for each session
});

// Use the session middleware
app.use(sessionMiddleware);

// Create a http server with the express app
const server = http.createServer(app);

const io = new socketio.Server(server);

// Define an api route that returns the session_id
app.get("/api/session", (req, res) => {
  // Get the session_id from the request session
  const session_id = req.session.id;
  // Send it as a response
  res.send(session_id);
});

// Define a socket.io event handler for connection
io.on("connection", (socket) => {
  // Get the session_id from the socket handshake session
  const session_id = (socket.handshake as any).session.id;
  // Log it to the console
  console.log(`A socket connected with session_id: ${session_id}`);
  // Emit a message to the socket with the session_id
  socket.emit("message", `Your session_id is ${session_id}`);
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// serve the public folder as static assets
app.use(express.static("public"));
