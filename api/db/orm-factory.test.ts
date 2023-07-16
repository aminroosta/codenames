import { v4 } from "uuid";

import { getOrm } from "./orm-factory";

test("initialize works fine", () => {
  const orm = getOrm(":memory:");

  const user = { user_id: v4(), nickname: "Jon" };
  const res = orm.insert({ into: "users", data: user });
  expect(res).toEqual(user);

  const all = orm.query({ from: "users" });
  expect(all).toEqual([user]);
});
