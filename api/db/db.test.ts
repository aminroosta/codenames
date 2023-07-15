import { Database } from "bun:sqlite";
import { expect, test } from "bun:test";
import { v4 } from 'uuid';

import { initialize } from "./db";
import * as orm from "./orm";

test("initialize works fine", () => {
  const db = new Database(":memory:");
  initialize(db);

  const user = { user_id: v4(), nickname: "Jon" };
  const res = orm.insert(db, { into: "users", data: user, });
  expect(res).toEqual(user);

  const all = orm.query(db, { from: "users", });
  expect(all).toEqual([user]);
});

