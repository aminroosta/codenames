import { expect, test } from "bun:test";
import { v4 } from "uuid";
import { getOrm } from "./orm-factory";
import { roomRepo } from "./room-repo";


test("room repo", () => {
  const repo = roomRepo(getOrm(":memory:"));

  const owner_id = v4();
  const room = repo.create({ user_id: owner_id });

  expect(room.owner_id).toEqual(owner_id);
  expect(room.status).toEqual('lobby');
  expect(room.room_id).toHaveLength(36);
  expect(room.name.split('-')).toHaveLength(3);
  expect(room.cards).toHaveLength(20);
});
