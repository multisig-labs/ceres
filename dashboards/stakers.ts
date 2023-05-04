import { Contract, providers } from "https://esm.sh/ethers@5.7.2?dts";

import loadConfig from "../lib/loadConfig.ts";
import { stakerTransformer } from "../lib/utils/transformers.js";
import type { Metrics, ReturnedMetric } from "../lib/types.ts";

// This is fishy and needs fixed
const getAllStakers = async () => {
  const { contracts, deployment } = await loadConfig();
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
  return stakerTransformer(resp);
};

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
      // deno-lint-ignore no-explicit-any
      formatter: (metrics: Metrics, res: any[]): ReturnedMetric => {
        return {
          name: metrics.metric.name,
          title: metrics.metric.title,
          desc: metrics.metric.desc,
          value: res.length,
        };
      },
    },
  },
];

export default stakerMetrics;
