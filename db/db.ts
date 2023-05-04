// See here for why I'm using this seemingly random
// source: https://github.com/eveningkid/denodb/issues/379#issuecomment-1445411440
// Revert back to official version when this is fixed
import {
  Database,
  SQLite3Connector,
} from "https://raw.githubusercontent.com/jerlam06/denodb/1b2e53461df56673d4048fe357c4d5ffaf5d8b1e/mod.ts";
// } from "https://deno.land/x/denodb@v1.2.0/mod.ts";

import { FloatMetric, IntegerMetric, StringMetric } from "./models.ts";

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
