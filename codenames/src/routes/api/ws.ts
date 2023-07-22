import { WebSocketServer, WebSocket } from 'ws';
import { json, parseCookie } from "solid-start";
import { AppApiEvent } from '~/common/types';
import { OrmType } from '~/api/db/orm';
import { roleRepo } from '~/api/repo/role-repo';
import { roomRepo } from '~/api/repo/room-repo';

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
  let ws_room_id = '';

  ws.on('error', console.error);
  ws.on('close', () => {
    const wsList = sidToWs.get(sid) || [];
    const index = wsList.findIndex((w) => w === ws);
    wsList.splice(index, 1);
    sidToWs.set(sid, wsList);
    if (wsList.length === 0) {
      sidToWs.delete(sid);
      roleRepo(orm).removeRole({ user_id: sid, room_id: ws_room_id });
      wsSend({
        room_id: ws_room_id,
        type: 'epoch',
        data: { roles: +new Date() }
      });
    }
  });

  ws.on('message', (data) => {
    const { type, data: payload } = JSON.parse(data.toString());
    if (type === 'ping') {
      return ws.send(JSON.stringify({ type: 'pong', data: { sid } }));
    }
    if (type === 'join') {
      const { room_id } = payload;
      ws_room_id = room_id;
      const userRole = roleRepo(orm).setRole({
        user_id: sid,
        room_id,
        role: 'none'
      });
      ws.send(JSON.stringify({ type: 'join', data: userRole }));
      wsSend({
        room_id,
        type: 'epoch',
        data: { roles: +new Date() }
      });
    }
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

