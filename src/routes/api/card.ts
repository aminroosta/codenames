
import { json } from "solid-start";
import { cardRepo } from "~/api/repo/card-repo";
import { clueRepo } from "~/api/repo/clue-repo";
import { roomRepo } from "~/api/repo/room-repo";
import { userRepo } from "~/api/repo/user-repo";
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

  const userRole = userRepo(orm).getRole({ user_id: sid, room_id });
  const [expectedColor, _] = userRole.role.split('-') as ['red' | 'blue', any];


  const shownCards = cardRepo(orm).getClueShowCards({ clue_id });
  const clue = clueRepo(orm).getById({ clue_id })!;

  if (
    (shownCards.length >= clue.count + 1) ||
    (shownCard.color !== expectedColor)
  ) {
    clueRepo(orm).finishClue({ clue_id });
  }

  const room = roomRepo(orm).getById({ room_id })!;
  if (shownCard.color === 'black') {
    clueRepo(orm).finishClue({ clue_id });
    roomRepo(orm).updateStatus({ room_id, status: `${expectedColor}-won` });
  }
  const blueLeft = room.cards.filter(c => c.face === 'down' && c.color == 'blue');
  const redLeft = room.cards.filter(c => c.face === 'down' && c.color == 'red');
  if (blueLeft.length === 0) {
    clueRepo(orm).finishClue({ clue_id });
    roomRepo(orm).updateStatus({ room_id, status: `blue-won` });
  }
  if (redLeft.length === 0) {
    clueRepo(orm).finishClue({ clue_id });
    roomRepo(orm).updateStatus({ room_id, status: `red-won` });
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
