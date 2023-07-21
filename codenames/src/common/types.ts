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
