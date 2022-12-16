import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";
import { providers } from "https://cdn.skypack.dev/ethers?dts";

import handlers from "./handlers/index.ts";
import type { Metrics, ReturnedMetric, ReturnedMetrics } from "./lib/types.ts";
import defaultFormatter from "./lib/defaultFormatter.ts";
import newDB from "./db/db.ts";

const { contractHandler, rpcHandler, restHandler } = handlers;

// import the dashboards
import dashboards from "./dashboards/index.ts";
import newModel from "./db/newModel.ts";

Deno.addSignalListener("SIGINT", () => {
  console.log("interrupted!");
  Deno.exit(0);
});

// read the contracts.json at runtime
const contractsRaw = await Deno.readTextFile("./config/contracts.json");
const contracts = JSON.parse(contractsRaw);

// read the deployment.json at runtime
const deploymentRaw = await Deno.readTextFile("./config/deployment.json");
const deployment = JSON.parse(deploymentRaw);

const provider = new providers.StaticJsonRpcProvider(
  deployment.sources.eth,
  deployment.sources.chain.chainID
);

const handler = async (metrics: Metrics): Promise<ReturnedMetric> => {
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

const gatherDashboards = async (): Promise<ReturnedMetrics> => {
  // flatten the dashboards
  // spread (...) doesn't work on dashboards because it's a default export
  const metrics = dashboards.reduce((acc, curr) => [...acc, ...curr], []);
  const results = await Promise.all(metrics.map(handler));
  const obj = {} as ReturnedMetrics;
  results.forEach((result) => {
    obj[result.name as string] = result;
  });
  return obj;
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
  // get all the values from the results
  await newDB("./metrics.db");
  await Promise.all(
    Object.values(results).map(async (result) => {
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
