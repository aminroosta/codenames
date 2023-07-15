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
  genid: () => uuid.v4(),
});

app.use(sessionMiddleware);

const server = http.createServer(app);
const io = new socketio.Server(server);

app.get("/api/session", (req, res) => {
  const session_id = req.session.id;
  res.send(session_id);
});

io.on("connection", (socket) => {
  const session_id = (socket.handshake as any).session.id;
  console.log(`A socket connected with session_id: ${session_id}`);
  socket.emit("message", `Your session_id is ${session_id}`);
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.use(express.static("public"));
