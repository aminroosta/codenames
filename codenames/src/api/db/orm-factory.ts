import Database, { Database as DB } from "better-sqlite3";
import { Orm, OrmType } from "./orm";
import schema from "./schema";

export function initialize(db: DB) {
  schema
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement)
    .forEach((statement) => {
      db.exec(statement);
    });
}

let db: DB | null = null;

export function getOrm(file: string): OrmType {
  if (file == ":memory:") {
    const mem = new Database(":memory:");
    initialize(mem);
    return Orm(mem);
  }
  if (db === null) {
    db = new Database(file);
    initialize(db);
  }

  return Orm(db);
}
