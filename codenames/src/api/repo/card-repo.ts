
import { OrmType } from "../db/orm";

export const cardRepo = (orm: OrmType) => {
  const getRoomShownCards = ({ room_id }: { room_id: string }) => {
    const cards = orm.query<{ card_idx: number }>({
      from: 'shown_cards s join clues c using(clue_id) join rooms r using(room_id)',
      where: { 'r.room_id': room_id },
      select: 'distinct s.card_idx'
    });

    return cards.map(({ card_idx }) => card_idx);
  };

  const getClueShowCards = ({ clue_id }: { clue_id: string }) => {
    const cards = orm.query<{ card_idx: number }>({
      from: 'shown_cards s join clues c using(clue_id)',
      where: { 'c.clue_id': clue_id },
      select: 's.card_idx'
    });

    return cards.map(({ card_idx }) => card_idx);
  };


  const showCard = ({ clue_id, card_idx, user_id }: {
    clue_id: string,
    card_idx: number,
    user_id: string
  }) => {
    const card = orm.insert({
      into: 'shown_cards',
      data: { clue_id, card_idx, user_id }
    });

    let result = orm.query({
      from: 'rooms r join clues c using(room_id)',
      where: { 'c.clue_id': card.clue_id },
      select: 'r.cards'
    });
    const cards = JSON.parse(result[0].cards as string);
    return {
      ...card,
      color: cards[card.card_idx].color as string
    };
  };

  return {
    showCard,
    getRoomShownCards,
    getClueShowCards,
  };
};

