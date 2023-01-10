import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { utils, BigNumber } from "npm:ethers@5.7.2";

const RewardsDashboard: Metrics[] = [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "RewardsPool",
      method: "canStartRewardsCycle",
      args: [],
      title: "Can Start Rewards Cycle",
      desc: "Whether or not a rewards cycle can be started",
      name: "canStartRewardsCycle",
      formatter: (m: Metrics, value: boolean): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value,
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "RewardsPool",
      method: "getRewardsCycleStartTime",
      args: [],
      title: "Rewards Cycle Seconds",
      desc: "The length of a rewards cycle",
      name: "rewardsCycleSeconds",
      formatter: (m: Metrics, value: BigNumber): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: new Date(value.toNumber() * 1000),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "RewardsPool",
      method: "getRewardsCyclesElapsed",
      args: [],
      title: "Rewards Cycles Elapsed",
      desc: "The number of rewards cycles that have elapsed",
      name: "rewardsCyclesElapsed",
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
      contract: "RewardsPool",
      method: "getRewardsCycleTotalAmt",
      args: [],
      title: "Rewards Cycle Seconds",
      desc: "The length of a rewards cycle",
      name: "rewardCycleTotalAmt",
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

export default RewardsDashboard;
