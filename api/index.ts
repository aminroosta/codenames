import * as socketio from "socket.io";
import http from "http";
import { getApp } from "./app";

const app = getApp({ dbFile: ":memory:" });
const server = http.createServer(app);

const io = new socketio.Server(server);
io.on("connection", (socket) => {
  // @ts-ignore
  const session_id = socket.handshake.session.id;

  console.log(
    `A socket connected with session_id: ${session_id}`
  );
  socket.emit("message", `Your session_id is ${session_id}`);
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});


