import { WebSocketServer, WebSocket } from 'ws';
import { json, parseCookie } from "solid-start";
import { AppApiEvent } from '~/common/types';
import { OrmType } from '~/api/db/orm';

const globalThis = global as any;
const sidToWs = new Map<string, WebSocket[]>();
let orm: OrmType;

const handler = (
  ws: WebSocket,
  { rawHeaders: headers }: Request & { rawHeaders: string[] }
) => {
  const cookeIndex = headers.findIndex((h) => h === 'Cookie');
  const { sid } = parseCookie(headers[cookeIndex + 1] || '');
  const wsList = sidToWs.get(sid) || [];
  wsList.push(ws);
  sidToWs.set(sid, wsList);

  ws.on('error', console.error);
  ws.on('close', () => {
    const wsList = sidToWs.get(sid) || [];
    const index = wsList.findIndex((w) => w === ws);
    wsList.splice(index, 1);
    sidToWs.set(sid, wsList);
  });

  ws.on('message', function message(data) {
    ws.send(JSON.stringify({ type: 'pong', data: { sid } }));
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

export const wsSend = ({
  room_id,
  type,
  data
}: {
  room_id: string,
  type: 'epoch',
  data: any
}) => {
  const user_ids = orm.query({
    from: 'user_roles',
    where: { room_id },
    select: ['user_id'],
  });
  user_ids.forEach(({ user_id }) => {
    const wsList = sidToWs.get(user_id as string) || [];
    wsList.forEach((ws) => {
      ws.send(JSON.stringify({ type, data }));
    });
  });
};

export function GET({ locals }: AppApiEvent) {
  orm = locals.orm;
  setupWebsocketServer();
  const port = globalThis.server ? 3000 : 8181;
  return json({ port });
}

