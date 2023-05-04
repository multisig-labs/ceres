// deno-lint-ignore-file no-explicit-any
import { providers } from "https://esm.sh/ethers@5.7.2?dts";
import type { Metrics } from "../lib/types.ts";

const customHandler = (
  provider: providers.Provider,
  metrics: Metrics,
  contracts: any,
  deployment: any,
): Promise<any> | any => {
  if (!metrics.metric.fn) throw new Error("Function not found");
  const args = metrics.metric.args || [];
  return metrics.metric.fn(provider, metrics, contracts, deployment, ...args);
};

export default customHandler;
