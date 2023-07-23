import { v4 } from "uuid";
import { OrmType } from "../db/orm";
import { generateMnemonic } from "bip39";
import { Room } from "~/common/types";
import { cardRepo } from "./card-repo";

export const roomRepo = (orm: OrmType) => {
  const format = (room: any) => {
    if (!room) { return null; }

    const cards = JSON.parse(room.cards);
    const shownCards = cardRepo(orm).getRoomShownCards({
      room_id: room.room_id
    });
    room.cards = cards.map((card: any, idx: number) => ({
      ...card,
      face: shownCards.includes(idx) ? 'up' : 'down'
    }));
    return room as Room;
  };
  const getByName = ({ name }: { name: string }) => {
    const [room = null] = orm.query<any>({ from: "rooms", where: { name } })
    return format(room);
  };
  const getById = ({ room_id }: { room_id: string }) => {
    const [room = null] = orm.query<any>({ from: "rooms", where: { room_id } })
    return format(room);
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
    status: 'lobby' | 'red-won' | 'blue-won'
  }) => {
    const [room] = orm.update<any>({
      table: 'rooms',
      where: { room_id },
      set: { status }
    });
    return room && { ...room, cards: JSON.parse(room.cards) } as Room;
  };

  const getShownCards = ({ room_id }: { room_id: string }) => {
    const cards = orm.query<{ card_idx: number }>({
      from: 'shown_cards s join clues c using(clue_id)',
      where: { 'c.room_id': room_id },
      select: 's.card_idx'
    });

    return cards.map(({ card_idx }) => card_idx);
  };

  const reset = ({ room_id }: { room_id: string }) => {
    const cards = generateCards();

    const room = orm.update({
      table: "rooms",
      where: { room_id },
      set: {
        cards: JSON.stringify(cards),
        status: 'lobby'
      },
    });

    orm.update({
      table: 'user_roles',
      where: { room_id },
      set: { role: 'none' }
    });

    orm.remove({
      from: 'clues',
      where: { room_id }
    });

    return room;
  };

  return {
    create,
    reset,
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
    "red", "red", "red", "red", "red", "red", "red",
    Math.random() > 0.5 ? "red" : "blue",
  ];
  shuffleArray(colors);

  const cards: { image: string, color: string }[] = [];

  for (let i = 0; cards.length < colors.length; i++) {
    const idx = Math.floor(Math.random() * (279 - 0 + 1)) + 0;
    const image = `card-${idx}.svg`;
    if (cards.find(c => c.image === image)) { continue; }
    cards.push({ image, color: colors[i] });
  }

  return cards;
};

