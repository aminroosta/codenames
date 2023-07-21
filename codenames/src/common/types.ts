import { APIEvent } from "solid-start";
import { OrmType } from "~/api/db/orm";

export type UserRole = 'red-operator'
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

export type Room = {
  room_id: string;
  user_id: string;
  name: string;
  cards: {
    image: string,
    color: 'red' | 'blue' | 'black' | 'neutral'
  }[];
  status: RoomStatus;
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

