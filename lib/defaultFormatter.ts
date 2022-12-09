import type { Metrics } from "./types.ts";

// deno-lint-ignore no-explicit-any
export default (m: Metrics, v: any) => {
  return {
    title: m.metric.title,
    desc: m.metric.desc,
    value: v,
  };
};
