import { parse } from "https://deno.land/std@0.119.0/flags/mod.ts";
import { providers } from "https://cdn.skypack.dev/ethers?dts";

import handlers from "./handlers/index.ts";
import type { Metrics } from "./lib/types.ts";
import defaultFormatter from "./lib/defaultFormatter.ts";
import newDB from "./db/db.ts";

const { contractHandler, rpcHandler, restHandler } = handlers;

// import the contract ABIs
import contracts from "./config/contracts.json" assert { type: "json" };
// import the deployment from the config
import deployment from "./config/deployment.json" assert { type: "json" };
// import the dashboards
import dashboards from "./dashboards/index.ts";
import newModel from "./db/newModel.ts";

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

  if (metrics.metric?.formatter) {
    return metrics.metric.formatter(metrics, res);
  }
  return defaultFormatter(metrics, res);
};

const gatherDashboards = async () => {
  // flatten the dashboards
  const metrics = dashboards.reduce((acc, curr) => [...acc, ...curr], []);
  const results = await Promise.all(metrics.map(handler));
  return results;
};

const flags = parse(Deno.args, {
  string: ["mode", "port"],
  default: { mode: "stout", port: "8080" },
});

const serveHTTP = async (conn: Deno.Conn) => {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const results = await gatherDashboards();
    requestEvent.respondWith(
      new Response(JSON.stringify(results), {
        status: 200,
        headers: new Headers({
          "content-type": "application/json",
        }),
      })
    );
  }
};

const dumpToDB = async () => {
  const results = await gatherDashboards();
  await newDB("./metrics.db");
  await Promise.all(
    results.map(async (result) => {
      const metric = newModel(result);
      await metric.save();
    })
  );
};

switch (flags.mode) {
  case "stout": {
    const results = await gatherDashboards();
    console.log(results);
    break;
  }
  case "serve": {
    const server = Deno.listen({ port: parseInt(flags.port) });
    console.log(`Listening on port ${flags.port}`);
    for await (const conn of server) {
      serveHTTP(conn);
    }
    break;
  }
  case "dump":
    await dumpToDB();
    break;
  default:
    throw new Error(`Invalid mode: ${flags.mode}`);
}

Deno.exit(0);
