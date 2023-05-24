import { Contract, providers, BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

import loadConfig from "../lib/loadConfig.ts";
import { stakerTransformer } from "../lib/utils/transformers.js";
import type { Metrics, ReturnedMetric } from "../lib/types.ts";

const { contracts, deployment } = await loadConfig();

interface Staker {
  stakerAddr: string;
  avaxAssigned: BigNumber;
  avaxStaked: BigNumber;
  avaxValidating: BigNumber;
  avaxValidatingHighWater: BigNumber;
  ggpRewards: BigNumber;
  ggpStaked: BigNumber;
  lastRewardsCycleCompleted: BigNumber;
  rewardsStartTime: BigNumber;
  ggpLockedUntil: BigNumber;
}

// This is fishy and needs fixed
const getAllStakers = async () => {
  const provider = new providers.StaticJsonRpcProvider(
    deployment.sources.eth,
    deployment.chain.chainID,
  );

  const abi = contracts["Staking"]?.abi;
  const address = deployment.addresses?.["Staking"] as string;
  if (!abi) throw new Error("Contract ABI not found");
  const contract = new Contract(address, abi, provider);
  const args = [0, 0];
  const resp = await contract["getStakers"](...args);
  return stakerTransformer(resp) as Promise<Staker[]>;
};

const getEffectiveGGPStake = async () => {
  const stakers = await getAllStakers();
  // remove all stakers where avaxStaked is zero
  const filteredStakers = stakers.filter((staker) => {
    return staker.avaxStaked.gt(0);
  });
  let totalStake = BigNumber.from(0);
  filteredStakers.forEach((staker) => {
    totalStake = totalStake.add(staker.ggpStaked);
  });

  return totalStake;
}

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
      }
    }
  }
];

export default stakerMetrics;
