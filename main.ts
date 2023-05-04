import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";
import { providers } from "https://esm.sh/ethers@5.7.2?dts";

import {
  contractHandler,
  customHandler,
  restHandler,
  rpcHandler,
} from "./handlers/index.ts";
import type { Metrics, ReturnedMetric, ReturnedMetrics } from "./lib/types.ts";
import defaultFormatter from "./lib/defaultFormatter.ts";
import newDB from "./db/db.ts";
import newModel from "./db/newModel.ts";
import loadConfig from "./lib/loadConfig.ts";

// import the dashboards
import dashboards from "./dashboards/index.ts";

Deno.addSignalListener("SIGINT", () => {
  console.log("interrupted!");
  Deno.exit(0);
});

const flags = parse(Deno.args, {
  string: ["mode", "port", "path", "concurrency"],
  boolean: ["json"],
  alias: {
    mode: "m",
    port: "p",
    path: "d",
    concurrency: "n",
    json: "j",
  },
  default: {
    mode: "stout",
    port: "8080",
    path: "./metrics.db",
    concurrency: "15",
    json: false,
  },
});

const concurrentRequests = parseInt(flags.concurrency);

const { contracts, deployment } = await loadConfig();

const provider = new providers.StaticJsonRpcProvider(
  deployment.sources.eth,
  deployment.chain.chainID,
);

const handler = async (metrics: Metrics): Promise<ReturnedMetric> => {
  let res;
  try {
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
  } catch (e) {
    console.log("Error in handler: ", metrics.metric?.name || "unknown");
    console.error(e);
    // set the response to be null
    res = null;
  }
  return defaultFormatter(metrics, res);
};

const gatherDashboards = async (
  concurrentRequests = 15,
): Promise<ReturnedMetrics> => {
  // flatten the dashboards
  // spread (...) doesn't work on dashboards because it's a default export
  const metrics = dashboards.reduce((acc, curr) => [...acc, ...curr], []);
  // chunk metrics into groups of 10
  const metricChunks: Metrics[][] = [];
  while (metrics.length > 0) {
    metricChunks.push(metrics.splice(0, concurrentRequests));
  }
  const results = [];
  for (const chunk of metricChunks) {
    const res = await Promise.all(chunk.map(handler));
    results.push(...res);
  }
  const obj = {} as ReturnedMetrics;
  results.forEach((result) => {
    obj[result.name as string] = result;
  });
  return obj;
};

const serveHTTP = async (conn: Deno.Conn) => {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const results = await gatherDashboards(concurrentRequests);
    requestEvent.respondWith(
      new Response(JSON.stringify(results), {
        status: 200,
        headers: new Headers({
          "content-type": "application/json",
        }),
      }),
    );
  }
};

const dumpToDB = async (path: string) => {
  const results = await gatherDashboards(concurrentRequests);
  // get all the values from the results
  await newDB(path);
  await Promise.all(
    Object.values(results).map(async (result) => {
      const metric = newModel(result);
      await metric.save();
    }),
  );
};

try {
  switch (flags.mode) {
    case "stout": {
      const results = await gatherDashboards(concurrentRequests);
      if (flags.json) {
        console.log(JSON.stringify(results));
      } else {
        console.log(results);
      }
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
