import { v4 } from "uuid";
import { Role, User } from "~/common/types";
import { OrmType } from "../db/orm";

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

  const get = ({ user_id }: { user_id: string }) => {
    const [user = null] = orm.query({ from: "users", where: { user_id } });
    return user;
  };

  const all = () => {
    return orm.query({ from: "users" });
  };

  const setRole = ({
    user_id,
    room_id,
    role,
  }: { user_id: string, room_id: string, role: Role }) => {
    let [userRole = null] = orm.update({
      table: "user_roles",
      where: { user_id, room_id },
      set: { role },
    });
    if (!userRole) {
      userRole = orm.insert({
        into: "user_roles",
        data: { user_id, room_id, role },
      });
    }
    return userRole as { user_id: string, room_id: string, role: Role };
  };

  const getRole = ({ user_id, room_id }: { user_id: string, room_id: string }) => {
    const [userRole = null] = orm.query({
      from: "user_roles",
      where: { user_id, room_id },
    });
    return { user_id, room_id, role: (userRole?.role || 'none') as Role };
  };

  return {
    upsert,
    get,
    all,
    setRole,
    getRole,
  };
};
