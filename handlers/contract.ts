// deno-lint-ignore-file no-explicit-any
import { providers, Contract } from "npm:ethers@5.7.2";

import type { Metrics } from "../lib/types.ts";

const contractHandler = (
  provider: providers.Provider,
  metrics: Metrics,
  contracts: any,
  deployment: any
): Promise<any> => {
  const metric = metrics.metric;
  if (!metric?.contract) throw new Error("Contract not found");
  const abi = contracts[metric.contract]?.abi;
  const address = deployment.sources.addresses?.[metric.contract] as string;
  if (!abi) throw new Error("Contract ABI not found");
  const contract = new Contract(address, abi, provider);
  const args = metric.args || [];
  if (!metric.method) {
    throw new Error("Contract method not found");
  }
  return contract[metric.method](...args);
};

export default contractHandler;
