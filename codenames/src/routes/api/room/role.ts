
import { json } from "solid-start";
import { roleRepo } from "~/api/repo/role-repo";
import { roomRepo } from "~/api/repo/room-repo";
import { AppApiEvent } from "~/common/types";
import { wsSend } from "../ws";

export function GET({ locals: { orm, sid }, request }: AppApiEvent) {
  const url = new URL(request.url);
  const repo = roleRepo(orm);

  const name = url.searchParams.get("name")!;
  const { room_id } = roomRepo(orm).getByName({ name });
  const roles = repo.all({ room_id });

  return json(roles);
}

export async function POST(
  { locals: { orm, sid }, request }: AppApiEvent
) {
  const { room_id, role } = await new Response(request.body).json()
  const userRole = roleRepo(orm).setRole({ user_id: sid, room_id, role });
  wsSend({ room_id, type: 'epoch', data: { roles: +new Date() } });

  return json(userRole);
}

export function PATCH() {
  // ...
}

export function DELETE() {
  // ...
}
