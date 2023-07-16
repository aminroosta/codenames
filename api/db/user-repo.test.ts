import { expect, test } from "bun:test";
import { v4 } from "uuid";
import { userRepo } from "./user-repo";
import { getOrm } from "./orm-factory";


test("user repo", () => {
  const repo = userRepo(getOrm(":memory:"));

  expect(repo.all()).toEqual([]);

  const user = repo.upsert({ user_id: v4(), nickname: "Jon" });
  expect(repo.all()).toEqual([user]);

  const user2 = repo.upsert({ user_id: user.user_id, nickname: "Snow" });
  expect(user.user_id).toEqual(user2.user_id);

  const user3 = repo.get({ user_id: user.user_id });
  expect(user3).toEqual(user2);
});
