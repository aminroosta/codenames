import { Database } from "bun:sqlite";
import fs from "node:fs";
import * as orm from "./orm";

export function initialize(db: Database) {
  fs.readFileSync(__dirname + "/schema.sql", { encoding: "utf-8" })
    .split(";")
    .map(statement => statement.trim())
    .filter(statement => statement)
    .forEach((statement) => {
      db.run(statement);
    });
}

let db: Database | null = null;

export type Orm = ReturnType<typeof getOrm>;

// FIXME: Refactor orm.ts file
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export function getOrm(file: string) {
  if (db === null) {
    db = new Database(file);
    initialize(db);
  }

  return {
    insert: orm.insert.bind(null, db) as OmitFirstArg<typeof orm.insert>,
    query: orm.query.bind(null, db) as OmitFirstArg<typeof orm.query>,
    update: orm.update.bind(null, db) as OmitFirstArg<typeof orm.update>,
    remove: orm.remove.bind(null, db) as OmitFirstArg<typeof orm.remove>,
  }
}

