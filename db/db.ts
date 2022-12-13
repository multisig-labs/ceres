import {
  Database,
  SQLite3Connector,
} from "https://deno.land/x/denodb@v1.1.0/mod.ts";

import { StringMetric, IntegerMetric, FloatMetric } from "./models.ts";

const newDB = async (path: string): Promise<Database> => {
  const connector = new SQLite3Connector({
    filepath: path,
  });

  const db = new Database(connector);

  db.link([StringMetric, IntegerMetric, FloatMetric]);
  await db.sync();
  return db;
};

export default newDB;
