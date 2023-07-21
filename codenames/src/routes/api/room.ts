import { json } from "solid-start";
import { roomRepo } from "~/api/repo/room-repo";
import { userRepo } from "~/api/repo/user-repo";
import { AppApiEvent } from "~/common/types";

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

export function PATCH() {
  // ...
}

export function DELETE() {
  // ...
}
