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
      name: "height",
      // deno-lint-ignore no-explicit-any
      formatter: (m: Metrics, value: any) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value.height,
        };
      },
    },
  } as Metrics,
];
