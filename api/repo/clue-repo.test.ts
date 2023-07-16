import { getOrm } from "../db/orm-factory";
import { clueRepo } from "./clue-repo";
import { userRepo } from "./user-repo";
import { roomRepo } from "./room-repo";


it("clue repo", () => {
  const orm = getOrm(":memory:");
  const repo = clueRepo(orm);
  const user = userRepo(orm).upsert({ nickname: "Jon" });
  const room = roomRepo(orm).create({ user_id: user.user_id });

  const clue = repo.create({
    room_id: room.room_id,
    user_id: user.user_id,
    word: 'Snow',
    count: 1
  });
  expect(clue.clue_id).toHaveLength(36);
  expect(clue.room_id).toEqual(room.room_id);

  expect(repo.getAll({ room_id: room.room_id })).toEqual([clue]);
  expect(repo.getActiveClue({ room_id: room.room_id })).toEqual(clue);

  expect(() => {
    repo.create({
      room_id: room.room_id, user_id: user.user_id,
      word: 'Rain', count: 2
    });
  }).toThrow();

  expect(repo.getShownCards({ clue_id: clue.clue_id })).toEqual([]);
  repo.showCard({ clue_id: clue.clue_id, card_idx: 5, user_id: user.user_id });
  expect(repo.getShownCards({ clue_id: clue.clue_id })).toEqual([5]);

  repo.toggleVote({ clue_id: clue.clue_id, user_id: user.user_id, card_idx: 5 });
  expect(repo.getVotes({ clue_id: clue.clue_id })).toEqual([
    { nicknames: ['Jon'], card_idx: 5 }
  ]);

  repo.finishClue({ room_id: room.room_id });
  expect(repo.getActiveClue({ room_id: room.room_id })).toEqual(null);
});
