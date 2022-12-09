import { providers } from "https://cdn.skypack.dev/ethers?dts";

import handlers from "./handlers/index.ts";
import type { Metrics } from "./lib/types.ts";

const { contractHandler, rpcHandler, restHandler } = handlers;

// import the contract ABIs
import contracts from "./config/contracts.json" assert { type: "json" };
// import the deployment from the config
import deployment from "./config/deployment.json" assert { type: "json" };
// import the dashboards
import dashboards from "./dashboards/index.ts";

const provider = new providers.StaticJsonRpcProvider(
  deployment.sources.eth,
  deployment.sources.chain.chainID
);

// deno-lint-ignore no-explicit-any
const handler = async (metrics: Metrics): Promise<any> => {
  let res;
  if (metrics.type === "contract") {
    res = await contractHandler(provider, metrics, contracts, deployment);
  } else if (metrics.type === "rpc") {
    res = await rpcHandler(metrics, deployment);
  } else if (metrics.type === "rest") {
    res = await restHandler(metrics, deployment);
  } else {
    throw new Error("Invalid metrics type");
  }

  return metrics.metric?.formatter ? metrics.metric.formatter(res) : res;
};

const main = async () => {
  // flatten the dashboards
  const metrics = dashboards.reduce((acc, curr) => [...acc, ...curr], []);
  const results = await Promise.all(metrics.map(handler));
  console.log(results);
};

await main();
