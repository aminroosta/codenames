import { WebSocketServer, WebSocket } from 'ws';
import { APIEvent, json } from "solid-start";

const globalThis = global as any;

const handler = (ws: WebSocket) => {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    ws.send(JSON.stringify([{ type: 'pong', data: ['something'] }]));
  });
}

// In dev mode this file is reloaded, we replace the handler to support HMR.
if (globalThis.handler) {
  globalThis.wss.off('connection', globalThis.handler);
  globalThis.wss.on('connection', handler);
  globalThis.handler = handler;
}

// Setup the websocket server.
function setupWebsocketServer() {
  if (!globalThis.wss) {
    const server = globalThis.server;
    const wss = new WebSocketServer(server ? { server } : { port: 8181 });
    wss.on('connection', handler);
    globalThis.handler = handler;
    globalThis.wss = wss;
  }
}

export function GET() {
  setupWebsocketServer();
  const port = globalThis.server ? 3000 : 8181;
  return json({ port });
}

