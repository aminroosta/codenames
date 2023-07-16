
import { v4 } from "uuid";
import { OrmType } from "./orm";
import { generateMnemonic } from "bip39";

export type Room = {
  room_id: string;
  owner_id: string;
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
        owner_id: user_id,
        room_id: v4(),
        name,
        cards: JSON.stringify(cards),
        status: 'lobby'
      },
    });

    return getByName({ name });
  };

  const getClues = ({ room_id }: { room_id: string }) => {
    const clues = orm.query<any>({
      from: 'clues',
      where: { room_id },
      order_by: 'created_at desc'
    });

    return clues.map(clue => ({ ...clue, votes: JSON.parse(clue.votes) })) as Clue[];
  };

  const getActiveClue = ({ room_id }: { room_id: string }) => {
    const [clue = null] = orm.query<any>({
      from: 'clues',
      where: { room_id, status: 'active' }
    });
    return clue && { ...clue, votes: JSON.parse(clue.votes) } as Clue;
  };

  const createClue = ({ room_id, user_id, word, count }: { room_id: string, user_id: string, word: string, count: number }) => {
    orm.insert({
      into: 'clues',
      data: {
        room_id,
        user_id,
        word,
        count,
        status: 'active',
        votes: JSON.stringify([]),
      }
    });
  };

  const finishClue = ({ room_id }: { room_id: string }) => {
    const [clue = null] = orm.update<any>({
      table: 'clues',
      where: { room_id, status: 'active' },
      set: { status: 'finished' }
    });
    return clue && { ...clue, votes: JSON.parse(clue.votes) } as Clue;
  };

  // const info = (room: Room, clues: Clue[]) => {
  //   const { cards } = room;
  // };

  return {
    create,
    getByName,
    getById,
    getClues,
    getActiveClue,
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

