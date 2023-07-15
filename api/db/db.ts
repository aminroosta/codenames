import { Database } from "bun:sqlite";
import fs from "node:fs";
import * as orm from "./orm";

// export const db = new Database(":memory:");

export function initialize(db: Database) {
  fs.readFileSync(__dirname + "/schema.sql", { encoding: "utf-8" })
    .split(";")
    .map(statement => statement.trim())
    .filter(statement => statement)
    .forEach((statement) => {
      db.run(statement);
    });
}

let db : Database | null = null;

export type DB = ReturnType<typeof getDb>;

export function getDb() {
  if(db === null) {
    db = new Database(":memory:");
    initialize(db);
  }

  return {
    insert: orm.insert.bind(null, db),
    query: orm.query.bind(null, db),
    update: orm.update.bind(null, db),
    remove: orm.remove.bind(null, db),
  }
}

