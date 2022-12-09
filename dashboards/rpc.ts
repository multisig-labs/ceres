// deno-lint-ignore-file no-explicit-any
import { Metrics } from "../lib/types.ts";

export default [
  {
    name: "RPC",
    type: "rpc",
    metric: {
      source: "ava",
      path: "/ext/bc/P",
      method: "platform.getHeight",
      body: {}, // this acts as the params
      title: "Height of Pchain",
      desc: "Friendly description",
      formatter: (v: any) => v, //or name of a defined formatting function,
    },
  } as Metrics,
];
