// deno-lint-ignore-file no-explicit-any
import { Metrics } from "../lib/types.ts";

export default [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "Contract",
      method: "method",
      args: [],
      formatter: (value: any) => value,
      title: "Title",
      desc: "Description",
    },
  } as Metrics,
];
