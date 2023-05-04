import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { MINIPOOL_STATUS_MAP } from "../lib/utils/utils.js";
import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

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
  },
);

export default [
  ...minipoolCalls,
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "MinipoolManager",
      method: "getTotalAVAXLiquidStakerAmt",
      args: [],
      title: "Total AVAX Liquid Staker Amount",
      desc: "Total amount of AVAX liquid stakers have deposited",
      name: "totalAVAXLiquidStakerAmt",
      formatter: (m: Metrics, value: BigNumber) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: Number(utils.formatEther(value)),
        } as ReturnedMetric;
      },
    },
  } as Metrics,
];
