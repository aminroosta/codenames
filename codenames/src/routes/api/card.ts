
import { json } from "solid-start";
import { cardRepo } from "~/api/repo/card-repo";
import { clueRepo } from "~/api/repo/clue-repo";
import { AppApiEvent } from "~/common/types";
import { wsSend } from "./ws";

export function GET() {
  // ...
}

export async function POST(
  { locals: { orm, sid }, request }: AppApiEvent
) {
  const { clue_id, card_idx } = await new Response(request.body).json()
  const shownCard = cardRepo(orm).showCard({ clue_id, user_id: sid, card_idx });
  const { room_id } = clueRepo(orm).getById({ clue_id })!;

  const shownCards = cardRepo(orm).getClueShowCards({ clue_id });
  const clue = clueRepo(orm).getById({ clue_id })!;
  console.log(clue.count, shownCards.length);
  if (shownCards.length >= clue.count + 1) {
    clueRepo(orm).finishClue({ clue_id });
  }

  wsSend({
    room_id,
    type: 'epoch',
    data: { room: +new Date(), clues: +new Date() }
  });

  return json(shownCard);
}

export function PATCH() {
  // ...
}

export function DELETE() {
  // ...
}
