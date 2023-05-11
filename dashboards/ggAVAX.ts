// deno-lint-ignore-file no-explicit-any
import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { utils, BigNumberish } from "https://esm.sh/ethers@5.7.2?dts";

const ggAVAXDashboard: Metrics[] = [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "totalAssets",
      args: [],
      formatter: (m: Metrics, value: any): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
      title: "Total ggAVAX Assets",
      desc: "Total value of assets in the ggAVAX vault",
      name: "totalAssets",
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "lastSync",
      args: [],
      title: "Last Sync",
      desc: "The effective start of the last cycle",
      name: "lastSync",
      formatter: (m: Metrics, value: any) => {
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
      contract: "TokenggAVAX",
      method: "lastRewardsAmt",
      args: [],
      title: "Last Rewards Amount",
      desc: "The amount of rewards distributed in the last cycle",
      name: "lastRewardsAmt",
      formatter: (m: Metrics, value: any) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "totalReleasedAssets",
      args: [],
      title: "Total Released Assets",
      desc: "The total amount of assets released from the vault",
      name: "totalReleasedAssets",
      formatter: (m: Metrics, value: any) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "stakingTotalAssets",
      args: [],
      title: "Staking Total Assets",
      desc: "The total amount of assets in the staking contract",
      name: "stakingTotalAssets",
      formatter: (m: Metrics, value: any) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "amountAvailableForStaking",
      args: [],
      title: "Amount Available For Staking",
      desc: "The amount of assets available for staking",
      name: "amountAvailableForStaking",
      formatter: (m: Metrics, value: any) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
    },
  },
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "previewDeposit",
      args: [utils.parseUnits("1.0")],
      title: "ggAVAX Exchange Rate",
      desc: "The amount of ggAVAX you will receive for 1 AVAX",
      name: "ggavaxAvaxExchangeRate",
      formatter: (m: Metrics, value: BigNumberish) => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      }
    }
  }
];

export default ggAVAXDashboard;
