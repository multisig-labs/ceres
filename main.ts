import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";
import { providers } from "npm:ethers@5.7.2";

import handlers from "./handlers/index.ts";
import type { Metrics, ReturnedMetric, ReturnedMetrics } from "./lib/types.ts";
import defaultFormatter from "./lib/defaultFormatter.ts";
import newDB from "./db/db.ts";
import newModel from "./db/newModel.ts";
import loadConfig from "./lib/loadConfig.ts";

const { contractHandler, rpcHandler, restHandler, customHandler } = handlers;

// import the dashboards
import dashboards from "./dashboards/index.ts";

Deno.addSignalListener("SIGINT", () => {
  console.log("interrupted!");
  Deno.exit(0);
});

const { contracts, deployment } = await loadConfig();

const provider = new providers.StaticJsonRpcProvider(
  deployment.sources.eth,
  deployment.sources.chain.chainID
);

const handler = async (metrics: Metrics): Promise<ReturnedMetric> => {
  let res;
  switch (metrics.type) {
    case "contract":
      res = await contractHandler(provider, metrics, contracts, deployment);
      break;
    case "rpc":
      res = await rpcHandler(metrics, deployment);
      break;
    case "rest":
      res = await restHandler(metrics, deployment);
      break;
    case "custom":
      res = await customHandler(provider, metrics, contracts, deployment);
      break;
    default:
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
  string: ["mode", "port", "path"],
  default: { mode: "stout", port: "8080", path: "./metrics.db" },
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

const dumpToDB = async (path: string) => {
  const results = await gatherDashboards();
  // get all the values from the results
  await newDB(path);
  await Promise.all(
    Object.values(results).map(async (result) => {
      const metric = newModel(result);
      await metric.save();
    })
  );
};

try {
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
      await dumpToDB(flags.path);
      break;
    default:
      throw new Error(`Invalid mode: ${flags.mode}`);
  }
} catch (e) {
  console.error(e);
  Deno.exit(1);
}

Deno.exit(0);
