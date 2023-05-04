import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

const StakingDashboard: Metrics[] = [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "Staking",
      method: "getStakerCount",
      args: [],
      title: "Staker Count",
      desc: "The number of stakers",
      name: "stakerCount",
      formatter: (m: Metrics, value: BigNumber): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value.toNumber(),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "Staking",
      method: "getTotalGGPStake",
      args: [],
      title: "Total GGP Stake",
      desc: "The total amount of GGP staked",
      name: "totalGGPStake",
      formatter: (m: Metrics, value: BigNumber): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: Number(utils.formatEther(value)),
        };
      },
    },
  },
];

export default StakingDashboard;
