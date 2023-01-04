import { Metrics, ReturnedMetric } from "../lib/types.ts";
import { MINIPOOL_STATUS_MAP } from "../lib/utils/utils.js";
// import { minipoolTransformer } from "../lib/utils/transformers.js";

const minipoolCalls: Metrics[] = Object.keys(MINIPOOL_STATUS_MAP).map(
  (status) => {
    const s = parseInt(status);
    status = MINIPOOL_STATUS_MAP[s as keyof typeof MINIPOOL_STATUS_MAP];
    return {
      type: "contract",
      metric: {
        source: "eth",
        contract: "MinipoolManager",
        method: "getMinipools",
        args: [s, 0, 0],
        // deno-lint-ignore no-explicit-any
        formatter: (m: Metrics, value: any) => {
          return {
            name: m.metric.name,
            title: m.metric.title,
            desc: m.metric.desc,
            value: value.length,
          } as ReturnedMetric;
        },
        title: `Minipools ${status}`,
        desc: `Total number of minipools in ${status}`,
        name: `minipools${status}`,
      },
    } as Metrics;
  }
);

export default minipoolCalls;
