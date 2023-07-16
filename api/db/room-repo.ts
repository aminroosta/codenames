
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

export const roomRepo = (orm: OrmType) => {
  const get = ({ name }: { name: string }) => {

    const [room] = orm.query<any>({ from: "rooms", where: { name } })
    if (room) {
      return {
        ...room,
        cards: JSON.parse(room.cards)
      } as Room;
    }
    return null;
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

    return get({ name });
  };

  return {
    create,
    get,
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

