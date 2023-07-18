import { WebSocketServer, WebSocket } from 'ws';
import { APIEvent, json } from "solid-start";

const globalThis = global as any;

const handler = (ws: WebSocket) => {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    ws.send(JSON.stringify([{ type: 'pong', data: ['something'] }]));
  });
}

// handle HMR
if (globalThis.handler) {
  globalThis.wss.off('connection', globalThis.handler);
  globalThis.wss.on('connection', handler);
  globalThis.handler = handler;
}

if (!globalThis.wss) {
  const server = globalThis.server;
  const wss = new WebSocketServer(server || { port: 8181 });
  wss.on('connection', handler);
  globalThis.handler = handler;
  globalThis.wss = wss;
}

export function GET() {
  return json({ port: 8181 });
}

