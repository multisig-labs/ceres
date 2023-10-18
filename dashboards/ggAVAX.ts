// deno-lint-ignore-file no-explicit-any
import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import {
  BigNumberish,
  Contract,
  utils,
  providers,
} from "https://esm.sh/ethers@5.7.2?dts";

const getMostRecentEvent = async (
  provider: providers.Provider,
  contracts: any,
  deployment: any,
  direction: string
) => {
  const currentBlockNumber = await provider.getBlockNumber();
  const blocksPerDay = 42000; // guess based on https://snowtrace.io/chart/blocks
  const fromBlock = Math.max(currentBlockNumber - blocksPerDay, 0);
  const ggAVAX = contracts.TokenggAVAX;
  const contract = new Contract(
    deployment.addresses.TokenggAVAX,
    ggAVAX.abi,
    provider
  );
  const contractInterface = new utils.Interface(ggAVAX.abi);
  const events = await contract.queryFilter(
    direction === "deposit"
      ? contract.filters.Deposit()
      : contract.filters.Withdraw(),
    fromBlock
  );
  const sortedEvents = events.sort((a, b) => b.blockNumber - a.blockNumber);
  const mostRecentEvent = sortedEvents[0];
  const decodedLog = contractInterface.parseLog(mostRecentEvent);
  const shares = decodedLog.args.shares;
  return shares;
};

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
      },
    },
  },
  {
    type: "custom",
    metric: {
      source: "eth",
      name: "ggAVAXRecentWithdraw",
      title: "Most Recent ggAVAX Withdraw",
      desc: "The most recent ggAVAX withdraw",
      formatter: (m: Metrics, value: BigNumberish): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
      fn: async (provider, _, contracts, deployment) => {
        return await getMostRecentEvent(
          provider,
          contracts,
          deployment,
          "withdraw"
        );
      },
    },
  },
  {
    type: "custom",
    metric: {
      source: "eth",
      name: "ggAVAXRecentDeposit",
      title: "Most Recent ggAVAX Deposit",
      desc: "The most recent ggAVAX deposit",
      formatter: (m: Metrics, value: BigNumberish): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(utils.formatEther(value)),
        };
      },
      fn: async (provider, _, contracts, deployment) => {
        return await getMostRecentEvent(
          provider,
          contracts,
          deployment,
          "deposit"
        );
      },
    },
  },
];

export default ggAVAXDashboard;
