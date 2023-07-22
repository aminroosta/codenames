
import { json } from "solid-start";
import { clueRepo } from "~/api/repo/clue-repo";
import { roleRepo } from "~/api/repo/role-repo";
import { roomRepo } from "~/api/repo/room-repo";
import { AppApiEvent } from "~/common/types";
import { wsSend } from "../ws";

export function GET({ locals: { orm, sid }, request }: AppApiEvent) {
  const url = new URL(request.url);
  const repo = clueRepo(orm);

  const name = url.searchParams.get("name")!;
  const { room_id } = roomRepo(orm).getByName({ name });
  const clues = repo.getAll({ room_id });

  return json(clues);
}

export async function POST(
  { locals: { orm, sid }, request }: AppApiEvent
) {
  const { room_id, word, count } = await new Response(request.body).json()
  const repo = clueRepo(orm);
  const clue = repo.create({ room_id, user_id: sid, word, count });

  wsSend({
    room_id,
    type: 'epoch',
    data: { clues: +new Date() }
  });

  return json(clue);
}

export function PATCH() {
  // ...
}

export function DELETE() {
  // ...
}
