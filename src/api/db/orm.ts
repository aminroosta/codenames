import { Database } from "better-sqlite3";

export type Row = Record<string, string | number | null | ArrayBuffer>;
export type Value = string | number | null | ArrayBuffer;
export type Condition = Record<string, Value>;

export function Orm(db: Database) {
  function all<R = Row>(query: string, values: Value[]): R[] {
    try {
      return db.prepare(query).all(...values) as any as R[];
    } catch (error: any) {
      error.message += [
        "\n       ",
        query,
        "\n       ",
        JSON.stringify({ values }),
      ].join("");
      throw error;
    }
  }

  /**!
   * Inserts a single row into and returns the inserted row.
   *
   * Example:
   * ```
   * insert(db, {
   *   into: "users",
   *   data: { name: "bob", age: 30 }
   * });
   * // { id: 1, name: "bob", age: 30 }
   * ```
   */
  function insert<R>({ into, data }: { into: string; data: R }): R {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const keys_ = keys.join(",");
    const values_ = values.map((_) => "?").join(",");

    const query = `INSERT INTO ${into} (${keys_}) VALUES (${values_}) RETURNING *;`;

    try {
      return db.prepare(query).get(...values) as any as R;
    } catch (error: any) {
      error.message += [
        "\n       ",
        query,
        "\n       ",
        JSON.stringify({ values }),
      ].join("");
      throw error;
    }
  }

  /**!
   * Inserts multiple rows and returns the inserted rows.
   *
   * Example:
   * ```
   * insert(db, {
   *   into: "users",
   *   data: [
   *     { name: "bob", age: 30 }
   *     { name: "tom", age: 20 }
   * });
   * // [
   * //   { id: 1, name: "bob", age: 30 },
   * //   { id: 2, name: "tom", age: 20 }
   * // ]
   * ```
   */
  function insertMany({ into, data }: { into: string; data: Row[] }) {
    const keys = Object.keys(data[0]);
    const keys_ = keys.join(",");

    const qs_ = "(" + keys.map((_) => "?").join(",") + ")";
    const values_ = data.map((_) => qs_).join(",");

    const values: Value[] = [];
    data.forEach((row) => values.push(...keys.map((key) => row[key])));

    const query = `INSERT INTO ${into} (${keys_}) VALUES ${values_} RETURNING *`;

    return all(query, values);
  }

  /**!
   * Internal function, used to convert "where:" conditions into sql queries.
   *
   * Example 1: The keys are expressions and they reference the value by "?".
   *            The keys are "AND"ed together.
   * ```
   *  _condition_to_sql({
   *      name: "bob",
   *      "age > ?": 31,
   *  })
   *  // { sql: "name = ? AND age > ?", values: ["bob", 31] }
   * ```
   *
   * Example 2: Use an array if you wan to "OR" the conditions.
   * ```
   *  _condition_to_sql([
   *      {
   *        "name LIKE ?": "Frank%",
   *        "age > ?": 31,
   *      },
   *      { height: 181 },
   *  ])
   *  // { sql: "(name = ? AND age > ?) OR (height = ?)", values: ["Frank%", 31, 181] }
   * ```
   */
  function _condition_to_sql(condition: Condition | Condition[]): {
    sql: string;
    values: Value[];
  } {
    if (Array.isArray(condition)) {
      const results = condition.map((c) => _condition_to_sql(c));
      const sql = results.map(({ sql }) => "(" + sql + ")").join(" OR ");
      const values = results.map(({ values }) => values).flat();
      return { sql, values };
    }

    const values = Object.values(condition as Condition);
    const keys = Object.keys(condition).map((key) =>
      key.includes("?") ? key : key + " = ?"
    );

    const sql = keys.join(" AND ");
    return { sql, values };
  }

  /**!
   * Internal function, used to select multiple columns.
   *
   * Example 1: The keys are expressions that come before the "AS" keyword.
   * ```
   *  _select_columns_to_sql({
   *      id: "id",
   *      "count(id)": "count",
   *  })
   *  // "id, count(id) AS count"
   * ```
   *
   * Example 2: You can also use an array.
   * ```
   *  _select_columns_to_sql([
   *     "id",
   *     "count(id) as count"
   *  ])
   *  // "id, count(id) AS count"
   * ```
   */
  function _select_columns_to_sql(
    expr: Record<string, string> | string[] | string | "*"
  ) {
    if (Array.isArray(expr)) {
      return expr.join(", ");
    }
    if (typeof expr == "string") {
      return expr;
    }
    return Object.entries(expr)
      .map(([key, value]) => (key == value ? key : `${key} AS ${value}`))
      .join(", ");
  }

  function _update_columns_to_sql(expr: Record<string, Value>) {
    const sql = Object.keys(expr)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(expr);
    return { sql, values };
  }

  /**!
   * Query database for one or more rows.
   * See the last example on how to join tables.
   *
   * Example 1: returns every row in albums table.
   * ```
   * query(db, { from: "albums" });
   * // [{id: 1, title: "Carry On"}, ...]
   * ```
   *
   * Example 2: returns every album that starts with "Carry".
   * ```
   * query(db, {
   *   from: "albums",
   *   where: {
   *     "Title LIKE ?": "Carry%",
   *   },
   * });
   * // [{id: 1, title: "Carry On"}]
   * ```
   *
   * Example 3: A more complex query.
   *            Note that in "where" clauses objects mean "AND" and arrays mean "OR".
   * ```
   * query(db, {
   *   from: "albums",
   *   where: [
   *     { Title: "Transmission" },
   *     {
   *       "Title LIKE ?": "%On",
   *       "ArtistId > ?": 57,
   *     },
   *   ],
   * });
   * // This would effectively run the following query:
   * // "SELECT * FROM albums WHERE (Title = ?) OR (Title LIKE ? AND ArtisID > ?)"
   * ```
   *
   * Example 4: A join example with select and group by.
   * ```
   * query(db, {
   *   select: {
   *     "a.Name": "Name",
   *     "count(*)": "count",
   *   },
   *   from: "artists a join albums b on a.ArtistId = b.ArtistId",
   *   group_by: "a.ArtistId",
   *   having: { "count > ?": 12 },
   * });
   * ```
   */
  function query<R = Row>({
    select = "*",
    from,
    where,
    group_by,
    having,
    order_by,
  }: {
    select?: string | string[] | Record<string, string>;
    from: string;
    group_by?: string;
    where?: Condition | Condition[];
    having?: Condition | Condition[];
    order_by?: string;
  }): R[] {
    const sql_: string[] = [];
    const values_: Value[] = [];
    sql_.push("SELECT", _select_columns_to_sql(select), "FROM", from);
    if (where) {
      const { sql, values } = _condition_to_sql(where);
      sql_.push("WHERE", sql);
      values_.push(...values);
    }
    if (group_by) {
      sql_.push("GROUP BY", group_by);
      if (having) {
        const { sql, values } = _condition_to_sql(having);
        sql_.push("HAVING", sql);
        values_.push(...values);
      }
    }
    if (order_by) {
      sql_.push("ORDER BY", order_by);
    }

    const query_ = sql_.join(" ") + ";";

    return all<R>(query_, values_);
  }

  /**!
   * Remove one or more rows from a table, and returns the deleted rows.
   *
   * Example 1: Deletes every row that matches the condition.
   * ```
   * remove(db, {
   *  from: "albums",
   *  where: { title: "Carry On" },
   * });
   * // [{id: 1, title: "Carry On"}]
   * ```
   */
  function remove<R = Row>({
    from,
    where,
  }: {
    from: string;
    where?: Condition | Condition[];
  }): R[] {
    const sql_: string[] = [];
    const values_: Value[] = [];
    sql_.push("DELETE FROM", from);
    if (where) {
      const { sql, values } = _condition_to_sql(where);
      sql_.push("WHERE", sql);
      values_.push(...values);
    }

    sql_.push("RETURNING *");

    const query_ = sql_.join(" ") + ";";

    return all<R>(query_, values_);
  }

  /**!
   * Update the matching rows to the given values.
   * Similar to other functions, update returns the affected rows.
   *
   * Example:
   * ```
   * update(db, {
   *  table: "albums",
   *  where: { title: "Carry On" },
   *  set: { title: "Carry On!" },
   * });
   * // [{id: 1, title: "Carry On!"}]
   * ```
   */
  function update<R = Row>({
    table,
    set,
    where,
  }: {
    table: string;
    set: Record<string, Value>;
    where?: Condition | Condition[];
  }): R[] {
    const sql_: string[] = [];
    const values_: Value[] = [];
    sql_.push("UPDATE", table);
    const { sql, values } = _update_columns_to_sql(set);
    sql_.push("SET", sql);
    values_.push(...values);

    if (where) {
      const { sql, values } = _condition_to_sql(where);
      sql_.push("WHERE", sql);
      values_.push(...values);
    }

    sql_.push("RETURNING *");

    const query_ = sql_.join(" ") + ";";

    return all<R>(query_, values_);
  }

  return {
    insert,
    query,
    remove,
    update,
  };
}

export type OrmType = ReturnType<typeof Orm>;
