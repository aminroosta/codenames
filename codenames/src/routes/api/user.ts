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

export function PATCH() {
  // ...
}

export function DELETE() {
  // ...
}


