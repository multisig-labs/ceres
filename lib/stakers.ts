import { Contract, providers, BigNumber } from "https://esm.sh/ethers@5.7.2?dts";

import loadConfig from "./loadConfig.ts";
import { stakerTransformer } from "./utils/transformers.js";

const { contracts, deployment } = await loadConfig();

export interface Staker {
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
export const getAllStakers = async () => {
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

export const getEffectiveGGPStake = async () => {
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
