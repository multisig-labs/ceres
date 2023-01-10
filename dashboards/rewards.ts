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
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "RewardsPool",
      method: "getInflationIntervalStartTime",
      args: [],
      title: "Inflation Interval Start Time",
      desc: "The start time of the current inflation interval",
      name: "inflationIntervalStartTime",
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
      method: "getInflationIntervalsElapsed",
      args: [],
      title: "Inflation Intervals Elapsed",
      desc: "The number of inflation intervals that have elapsed",
      name: "inflationIntervalsElapsed",
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
      method: "getInflationAmt",
      args: [],
      title: "Inflation Amount",
      desc: "The amount of inflation that will be distributed",
      name: "inflationAmt",
      formatter: (m: Metrics, value: BigNumber[]): ReturnedMetric => {
        const amt = value[1].sub(value[0]);
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: Number(utils.formatEther(amt)),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "RewardsPool",
      method: "getClaimingContractDistribution",
      args: ["ClaimNodeOp"],
      title: "Claiming Contract Distribution (NodeOp)",
      desc: "The distribution of the claiming contract for NodeOps",
      name: "claimingContractDistributionNodeOp",
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
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "RewardsPool",
      method: "getClaimingContractDistribution",
      args: ["ClaimProtocolDAO"],
      title: "Claiming Contract Distribution (ProtocolDAO)",
      desc: "The distribution of the claiming contract for ProtocolDAO",
      name: "claimingContractDistributionProtocolDAO",
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
