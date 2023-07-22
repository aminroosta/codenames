import { json } from "solid-start";
import { cardRepo } from "~/api/repo/card-repo";
import { roomRepo } from "~/api/repo/room-repo";
import { userRepo } from "~/api/repo/user-repo";
import { AppApiEvent } from "~/common/types";
import { wsSend } from "./ws";

export function GET({ locals: { orm, sid }, request }: AppApiEvent) {
  const url = new URL(request.url);
  const repo = roomRepo(orm);

  const name = url.searchParams.get("name");
  const id = url.searchParams.get("id");
  const room = name ? repo.getByName({ name })
    : id ? repo.getById({ room_id: id })
      : null;

  return json(room);
}

export async function POST(
  { locals: { orm, sid }, request }: AppApiEvent
) {
  const { nickname } = await new Response(request.body).json()
  const user = userRepo(orm).upsert({ user_id: sid, nickname });
  const room = roomRepo(orm).create({ user_id: user.user_id });
  return json(room);
}

export async function PATCH({ locals: { orm, sid }, request }: AppApiEvent) {
  const { room_id } = await new Response(request.body).json()
  const room = roomRepo(orm).reset({ room_id });

  wsSend({
    room_id,
    type: 'epoch',
    data: { room: +new Date(), user: +new Date(), roles: +new Date(), clues: +new Date() }
  });
  return json(room);
}

export function DELETE() {
  // ...
}
