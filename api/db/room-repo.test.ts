import { expect, test } from "bun:test";
import { v4 } from "uuid";
import { getOrm } from "./orm-factory";
import { roomRepo } from "./room-repo";
import { userRepo } from "./user-repo";


test("roomRepo", () => {
  const orm = getOrm(":memory:")
  const repo = roomRepo(orm);

  let { user_id } = userRepo(orm).upsert({ nickname: 'Jon' });

  let room = repo.create({ user_id });
  expect(room.user_id).toEqual(user_id);
  expect(room.status).toEqual('lobby');
  expect(room.room_id).toHaveLength(36);
  expect(room.name.split('-')).toHaveLength(3);
  expect(room.cards).toHaveLength(20);

  expect(repo.getByName({ name: room.name })).toEqual(room);
  expect(repo.getById({ room_id: room.room_id })).toEqual(room);

  const { status } = repo.updateStatus({ room_id: room.room_id, status: 'playing' });
  expect(status).toEqual('playing');
  expect(repo.getById({ room_id: room.room_id }).status).toEqual('playing');


  const cards = repo.getShownCards({ room_id: room.room_id });
  expect(cards).toEqual([]);
});

