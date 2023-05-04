import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

const ProtocolDAODashboard: Metrics[] = [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "ProtocolDAO",
      method: "getRewardsEligibilityMinSeconds",
      args: [],
      title: "Rewards Eligibility Min Seconds",
      desc:
        "The minimum amount of time a user must stake to be eligible for rewards",
      name: "rewardsEligibilityMinSeconds",
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
      contract: "ProtocolDAO",
      method: "getRewardsCycleSeconds",
      args: [],
      title: "Rewards Cycle Seconds",
      desc: "The length of a rewards cycle",
      name: "rewardsCycleSeconds",
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
      contract: "ProtocolDAO",
      method: "getInflationIntervalRate",
      args: [],
      title: "Inflation Interval Rate",
      desc: "The rate at which inflation is applied",
      name: "inflationIntervalRate",
      formatter: (m: Metrics, value: BigNumber): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value.toString(),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "ProtocolDAO",
      method: "getInflationIntervalSeconds",
      args: [],
      title: "Inflation Interval Seconds",
      desc: "The length of an inflation interval",
      name: "inflationIntervalSeconds",
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
      contract: "ProtocolDAO",
      method: "getMinipoolMinAVAXStakingAmt",
      args: [],
      title: "Minipool Min AVAX Staking Amount",
      desc: "The minimum amount of AVAX a minipool must stake",
      name: "minipoolMinAVAXStakingAmt",
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
      contract: "ProtocolDAO",
      method: "getMinipoolNodeCommissionFeePct",
      args: [],
      title: "Minipool Node Commission Fee Percent",
      desc: "The commission fee a node receives for operating a minipool",
      name: "minipoolNodeCommisionFeePct",
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
      contract: "ProtocolDAO",
      method: "getMinipoolMaxAVAXAssignment",
      args: [],
      title: "Minipool Max AVAX Assignment",
      desc: "The maximum amount of AVAX a minipool can be assigned",
      name: "minipoolMaxAVAXAssignment",
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
      contract: "ProtocolDAO",
      method: "getMinipoolMinAVAXAssignment",
      args: [],
      title: "Minipool Min AVAX Assignment",
      desc: "The minimum amount of AVAX a minipool can be assigned",
      name: "minipoolMinAVAXAssignment",
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
      contract: "ProtocolDAO",
      method: "getExpectedAVAXRewardsRate",
      args: [],
      title: "Expected AVAX Reward Rate",
      desc: "The expected AVAX reward rate",
      name: "expectedAVAXRewardRate",
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
      contract: "ProtocolDAO",
      method: "getMaxCollateralizationRatio",
      args: [],
      title: "Max Collateralization Ratio",
      desc: "The maximum collateralization ratio",
      name: "maxCollateralizationRatio",
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
      contract: "ProtocolDAO",
      method: "getMinCollateralizationRatio",
      args: [],
      title: "Min Collateralization Ratio",
      desc: "The minimum collateralization ratio",
      name: "minCollateralizationRatio",
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
      contract: "ProtocolDAO",
      method: "getTargetGGAVAXReserveRate",
      args: [],
      title: "Target GGAVAX Reserve Rate",
      desc: "The target GGAVAX reserve rate",
      name: "targetGGAVAXReserveRate",
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

export default ProtocolDAODashboard;
