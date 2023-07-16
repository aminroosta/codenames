
import { v4 } from "uuid";
import { OrmType } from "../db/orm";

export type Clue = {
  clue_id: string;
  room_id: string;
  user_id: string;
  word: string;
  count: number;
  status: 'active' | 'finished';
  created_at: Date;
};

export const clueRepo = (orm: OrmType) => {
  const getAll = ({ room_id }: { room_id: string }) => {
    const clues = orm.query<Clue>({
      from: 'clues',
      where: { room_id },
      order_by: 'created_at desc'
    });

    return clues;
  };

  const getActiveClue = ({ room_id }: { room_id: string }) => {
    const [clue = null] = orm.query<Clue>({
      from: 'clues',
      where: { room_id, status: 'active' }
    });
    return clue;
  };

  const create = ({ room_id, user_id, word, count }: {
    room_id: string,
    user_id: string,
    word: string,
    count: number
  }) => {
    const clue = orm.insert({
      into: 'clues',
      data: {
        clue_id: v4(),
        room_id,
        user_id,
        word,
        count,
        status: 'active',
      }
    });
    return clue as Clue;
  };

  const finishClue = ({ room_id }: { room_id: string }) => {
    const [clue = null] = orm.update({
      table: 'clues',
      where: { room_id, status: 'active' },
      set: { status: 'finished' }
    });
    return clue as any as Clue;
  };

  const getShownCards = ({ clue_id }: { clue_id: string }) => {
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
    orm.insert({
      into: 'shown_cards',
      data: { clue_id, card_idx, user_id }
    });
  };

  const toggleVote = ({ clue_id, card_idx, user_id }: {
    clue_id: string,
    card_idx: number,
    user_id: string
  }) => {
    const [removed = null] = orm.remove({
      from: 'votes',
      where: { clue_id, card_idx, user_id }
    });
    if (!removed) {
      return orm.insert({
        into: 'votes',
        data: { clue_id, card_idx, user_id }
      });
    }
    return null;
  };

  const getVotes = ({ clue_id }: { clue_id: string }) => {
    const votes = orm.query<{ card_idx: number, nicknames: string }>({
      from: 'votes v join users u using(user_id)',
      where: { 'v.clue_id': clue_id },
      group_by: 'v.card_idx',
      select: ['v.card_idx', "group_concat(u.nickname, '##') as nicknames"]
    });

    return votes.map(({ card_idx, nicknames }) => ({
      card_idx,
      nicknames: nicknames.split('##').sort()
    }));
  };

  return {
    create,
    getAll,
    getActiveClue,
    finishClue,
    showCard,
    getShownCards,
    toggleVote,
    getVotes,
  };
};

