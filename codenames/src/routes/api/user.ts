import { json } from "solid-start";
import { userRepo } from "~/api/repo/user-repo";
import { AppApiEvent } from "~/common/types";

export function GET({ locals: { orm, sid } }: AppApiEvent) {
  const user = userRepo(orm).get({ user_id: sid });
  return json(user || { user_id: sid, nickname: null });
}

export function POST() {
  // ...
}

export async function PUT({ locals: { orm, sid }, request }: AppApiEvent) {
  const { nickname } = await new Response(request.body).json()
  const user = userRepo(orm).upsert({ user_id: sid, nickname });
  return json(user);
}

export function DELETE() {
  // ...
}


