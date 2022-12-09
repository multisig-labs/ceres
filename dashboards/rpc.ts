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
    },
  } as Metrics,
];
