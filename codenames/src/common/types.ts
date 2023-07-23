import { APIEvent } from "solid-start";
import { OrmType } from "~/api/db/orm";

export type Role = 'red-operator'
  | 'blue-operator'
  | 'red-spymaster'
  | 'blue-spymaster'
  | 'none';

export type RoomStatus = 'lobby'
  | 'red-operator'
  | 'blue-operator'
  | 'red-spymaster'
  | 'blue-spymaster'
  | 'blue-won'
  | 'red-won';


export type AppApiEvent = APIEvent & {
  locals: {
    orm: OrmType;
    sid: string;
  }
};

export type User = {
  user_id: string;
  nickname: string;
};

export type Room = {
  room_id: string;
  user_id: string;
  name: string;
  cards: {
    image: string,
    color: 'red' | 'blue' | 'black' | 'neutral',
    face: 'up' | 'down'
  }[];
  status: 'lobby' | 'red-won' | 'blue-won';
};

export type Clue = {
  clue_id: string;
  room_id: string;
  user_id: string;
  word: string;
  count: number;
  status: 'active' | 'finished';
  created_at: Date;
};

export type UserRole = {
  room_id: string;
  user_id: string;
  role: Role;
  nickname: string;
};

export type Vote = {
  card_idx: number;
  nicknames: string[];
};
