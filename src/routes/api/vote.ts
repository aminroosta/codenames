import { json } from "solid-start";
import { AppApiEvent } from "~/common/types";
import { wsSend } from "./ws";
import { clueRepo } from "~/api/repo/clue-repo";

export function GET({ locals: { orm, sid }, request }: AppApiEvent) {
  const url = new URL(request.url);
  const repo = clueRepo(orm);

  const clue_id = url.searchParams.get("clue_id")!;
  const votes = repo.getVotes({ clue_id });
  return json(votes);
}


export async function POST({ locals: { orm, sid }, request }: AppApiEvent) {
  const { clue_id, card_idx } = await new Response(request.body).json()
  const repo = clueRepo(orm);
  repo.toggleVote({ clue_id, user_id: sid, card_idx });
  const clue = repo.getById({ clue_id })!;
  const votes = repo.getVotes({ clue_id });

  wsSend({
    room_id: clue.room_id,
    type: 'epoch',
    data: { votes: +new Date() }
  });

  return json(votes);
}

export function PUT() {
  // ...
}

export function DELETE() {
  // ...
}


