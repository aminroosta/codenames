import { Database } from "bun:sqlite";
import fs from "node:fs";
import { Orm, OrmType } from "./orm";

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

