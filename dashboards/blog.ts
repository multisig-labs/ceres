// deno-lint-ignore-file no-explicit-any
import { Metrics } from "../lib/types.ts";

// this is just an example to test if the REST API is working

export default [
  {
    type: "rest",
    metric: {
      source: "blog",
      path: "/getArticles?max=3",
      method: "get",
      formatter: async (m: Metrics, value: any) => {
        return {
          title: m.metric.title,
          desc: m.metric.desc,
          value: (await value.json()).items,
        };
      },
      title: "Chandlers Blog",
      desc: "Testing the REST API",
    },
  } as Metrics,
];
