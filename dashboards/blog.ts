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
      formatter: (value: any) => {
        return value.json().then((data: any) => {
          return data?.items;
        });
      },
      title: "Chandlers Blog",
      desc: "Testing the REST API",
    },
  } as Metrics,
];
