// deno-lint-ignore-file no-explicit-any
import { Metrics, ReturnedMetric } from "../lib/types.ts";

// Move to the dashboards folder in the root of the project

// this is just an example to test if the REST API is working

export default [
  {
    type: "rest",
    metric: {
      source: "blog",
      path: "/getArticles?max=3",
      method: "get",
      formatter: async (m: Metrics, value: any): Promise<ReturnedMetric> => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: JSON.stringify((await value.json()).items),
        };
      },
      title: "Chandlers Blog",
      desc: "Testing the REST API",
      name: "blog",
    },
  } as Metrics,
];
