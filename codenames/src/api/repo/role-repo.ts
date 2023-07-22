import { Role, UserRole } from "~/common/types";
import { OrmType } from "../db/orm";

export const roleRepo = (orm: OrmType) => {
  const all = ({ room_id }: { room_id: string }) => {
    return orm.query<UserRole>({
      from: "user_roles ur join users u using(user_id)",
      where: { room_id },
      select: ["user_id", "nickname", "room_id", "role"],
    });
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
    all,
    setRole,
    getRole,
  };
};
