import { v4 } from "uuid";
import { OrmType } from "./orm";

export type User = {
  user_id: string;
  nickname: string;
};
export const userRepo = (orm: OrmType) => {
  const upsert = ({ user_id = v4(), nickname }: { user_id?: string, nickname: string }) => {
    let [user = null] = orm.query<User>({ from: "users", where: { user_id } });
    if (!user) {
      user = orm.insert({
        into: "users",
        data: { user_id, nickname },
      });
    } else {
      user = orm.update<User>({
        table: "users",
        where: { user_id },
        set: { nickname },
      })[0];
    }

    return user;
  };

  const get = ({ user_id }) => {
    const [user = null] = orm.query({ from: "users", where: { user_id } });
    return user;
  };

  const all = () => {
    return orm.query({ from: "users" });
  };

  return {
    upsert,
    get,
    all,
  };
};
