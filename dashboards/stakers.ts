import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { getAllStakers, getEffectiveGGPStake, Staker } from "../lib/stakers.ts";

const stakerMetrics: Metrics[] = [
  {
    type: "custom",
    metric: {
      source: "custom",
      fn: getAllStakers,
      title: "Number of Stakers",
      desc: "Total number of stakers",
      name: "numStakers",
      args: [],
      formatter: (metrics: Metrics, res: Staker[]): ReturnedMetric => {
        return {
          name: metrics.metric.name,
          title: metrics.metric.title,
          desc: metrics.metric.desc,
          value: res.length,
        };
      },
    },
  },
  {
    type: "custom",
    metric: {
      source: "custom",
      fn: getEffectiveGGPStake,
      title: "Effective GGP Stake",
      desc: "Total GGP stake of all stakers with AVAX staked",
      name: "effectiveGGPStake",
      args: [],
      formatter: (metrics: Metrics, res: BigNumber): ReturnedMetric => {
        return {
          name: metrics.metric.name,
          title: metrics.metric.title,
          desc: metrics.metric.desc,
          value: parseFloat(utils.formatEther(res)),
        };
      },
    },
  },
];

export default stakerMetrics;
