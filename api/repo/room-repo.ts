
import { v4 } from "uuid";
import { OrmType } from "../db/orm";
import { generateMnemonic } from "bip39";

export type Room = {
  room_id: string;
  user_id: string;
  name: string;
  cards: {
    image: string,
    color: 'red' | 'blue' | 'black' | 'neutral'
  }[];
  status: 'lobby' | 'playing' | 'finished';
};

export type Clue = {
  room_id: string;
  user_id: string;
  word: string;
  count: number;
  votes: string[][]; // [[nickname], ...]
  status: 'active' | 'finished';
  created_at: Date;
};

export const roomRepo = (orm: OrmType) => {
  const getByName = ({ name }: { name: string }) => {
    const [room = null] = orm.query<any>({ from: "rooms", where: { name } })
    return room && { ...room, cards: JSON.parse(room.cards) } as Room;
  };
  const getById = ({ room_id }: { room_id: string }) => {
    const [room = null] = orm.query<any>({ from: "rooms", where: { room_id } })
    return room && { ...room, cards: JSON.parse(room.cards) } as Room;
  };

  const create = ({ user_id }: { user_id: string }) => {
    const name = generateMnemonic()
      .split(' ').slice(0, 3).join('-');

    const cards = generateCards();

    orm.insert({
      into: "rooms",
      data: {
        user_id,
        room_id: v4(),
        name,
        cards: JSON.stringify(cards),
        status: 'lobby'
      },
    });

    return getByName({ name });
  };

  const updateStatus = ({ room_id, status }: {
    room_id: string,
    status: 'lobby' | 'playing' | 'finished'
  }) => {
    const [room] = orm.update<any>({
      table: 'rooms',
      where: { room_id },
      set: { status }
    });
    return room && { ...room, cards: JSON.parse(room.cards) } as Room;
  };

  const getShownCards = ({ room_id }: { room_id: string }) => {
    const cards = orm.query<{card_idx: number}>({
      from: 'shown_cards s join clues c using(clue_id)',
      where: { 'c.room_id': room_id },
      select: 's.card_idx'
    });

    return cards.map(({ card_idx }) => card_idx);
  };

  return {
    create,
    getByName,
    getById,
    updateStatus,
    getShownCards,
  };
};

const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateCards = () => {
  const colors = [
    "black",
    "blue", "blue", "blue", "blue", "blue", "blue", "blue",
    "neutral", "neutral", "neutral", "neutral",
    "red", "red", "red", "red", "red", "red", "red", "red",
  ];
  shuffleArray(colors);

  const cards = [];
  for (let i = 0; i < colors.length; i++) {
    const idx = Math.floor(Math.random() * (279 - 0 + 1)) + 0;
    const image = `card-${idx}.jpg`;
    cards.push({ image, color: colors[i] });
  }

  return cards;
};

