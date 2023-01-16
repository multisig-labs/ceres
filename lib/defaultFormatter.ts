import type { Metrics, ReturnedMetric } from "./types.ts";

// deno-lint-ignore no-explicit-any
export default (m: Metrics, v: any): ReturnedMetric => {
  const { metric } = m;
  return {
    title: metric?.title,
    desc: metric?.desc,
    name: metric.name,
    value: v,
  };
};
