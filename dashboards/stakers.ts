import { providers, Contract } from "https://cdn.skypack.dev/ethers?dts";

import loadConfig from "../lib/loadConfig.ts";
import { stakerTransformer } from "../lib/utils/transformers.js";
import type { Metrics, ReturnedMetric } from "../lib/types.ts";

const getAllStakers = async () => {
  const { contracts, deployment } = await loadConfig();
  const provider = new providers.StaticJsonRpcProvider(
    deployment.sources.eth,
    deployment.sources.chain.chainID
  );

  const abi = contracts["Staking"]?.abi;
  const address = deployment.sources.addresses?.["Staking"] as string;
  if (!abi) throw new Error("Contract ABI not found");
  const contract = new Contract(address, abi, provider);
  const args = [0, 0];
  const resp = await contract["getStakers"](...args);
  return stakerTransformer(resp);
};
