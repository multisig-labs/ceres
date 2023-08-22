import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";
import { parse as parseCsv } from "https://deno.land/std@0.178.0/encoding/csv.ts";
import { providers } from "https://esm.sh/ethers@5.7.2?dts";
import { readFileSync } from "https://deno.land/x/deno@v0.38.0/std/node/fs.ts";
import * as path from "https://deno.land/x/deno@v0.38.0/std/node/path.ts";
// import * as parseCSV from "npm:csv-parse";
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
  deployment.chain.chainID
);

// helps the dashboards
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
  concurrentRequests = 15
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

const ggpCSandTSCalc = (): number[] => {
  const csvFilePath = path.resolve("./tokenholders.csv");
  const maxSupply = 22500000;
  let circulatingSupply = 0;
  const initialSupply = 18000000;
  let currentTotalSupply = 0;

  const headers = [
    "name",
    "percentageOfTotalSupply",
    "lockUpLengthMonths",
    "vestingLengthMonths",
    "vestingIntervalInMonths",
    "vestingStartDate",
    "initialTokens",
  ];

  const fileContent = readFileSync(csvFilePath, { encoding: "utf-8" });

  const tokenHolders = parseCsv(fileContent.toString(), {
    separator: ",",
    columns: headers,
    skipFirstRow: true,
  });

  // deno-lint-ignore no-explicit-any
  tokenHolders.forEach(function (holder: any) {
    // convert from string to date
    const [month, day, year] = holder.vestingStartDate.split("/");
    const vestingDate = new Date(+year, +month, +day);
    const now = new Date();

    if (now >= vestingDate) {
      const differenceInMonths = getMonthDifference(vestingDate, now);

      if (holder.vestingIntervalInMonths <= differenceInMonths) {
        if (holder.name === "IDO" || holder.name === "Liquidity") {
          circulatingSupply += Number(holder.initialTokens);
        } else {
          const percentageValue =
            parseFloat(holder.percentageOfTotalSupply) / 100;
          const totalTokensDue = maxSupply * percentageValue;

          const amtPerInterval =
            totalTokensDue /
            (holder.vestingLengthMonths / holder.vestingIntervalInMonths);
          const intervalsPassed =
            differenceInMonths / holder.vestingIntervalInMonths;

          circulatingSupply += amtPerInterval * intervalsPassed;
          if (holder.name == "Rewards") {
            // Coin gecko definition: # of coins minted, minus any coins burned, if fixed
            currentTotalSupply = circulatingSupply + initialSupply;
          }
        }
      }
    }
  });

  return [circulatingSupply, currentTotalSupply];
};

function getMonthDifference(startDate: Date, endDate: Date) {
  return (
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear())
  );
}

const cacheTime = 60 * 1000; // 1 minute

interface kvCache {
  // deno-lint-ignore no-explicit-any
  data: any;
  timestamp: number;
}

const kv = await Deno.openKv();

const serveHTTP = async (conn: Deno.Conn) => {
  const [circulatingSupply, totalSupply] = await ggpCSandTSCalc();
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    const url = new URL(requestEvent.request.url);
    if (url.pathname === "/ggpCirculatingSupply") {
      const results = circulatingSupply;
      requestEvent.respondWith(
        new Response(JSON.stringify(results), {
          status: 200,
          headers: new Headers({
            "content-type": "application/json",
          }),
        })
      );
    } else if (url.pathname === "/ggpTotalSupply") {
      const results = totalSupply;
      requestEvent.respondWith(
        new Response(JSON.stringify(results), {
          status: 200,
          headers: new Headers({
            "content-type": "application/json",
          }),
        })
      );
    } else {
      const filter = url.searchParams.get("filter");
      const useCache = url.searchParams.get("useCache") !== null;
      if (useCache) {
        // get the cache from the kv store
        const cache = await kv.get<kvCache>(["cache"]);
        if (cache.value) {
          // check the time. If the time is less than the current time, use the cache
          const cacheTime = new Date(cache.value.timestamp);
          const now = new Date();
          if (cacheTime > now) {
            requestEvent.respondWith(
              new Response(JSON.stringify(cache.value.data), {
                status: 200,
                headers: new Headers({
                  "content-type": "application/json",
                }),
              })
            );
            continue;
          }
        }
      }
      const results = await gatherDashboards(concurrentRequests);
      if (filter) {
        const filters = filter.split(",");
        // case insensitive. if the key contains the filter, return it
        Object.keys(results).forEach((key) => {
          const lowerKey = key.toLowerCase();
          filters.forEach((filter) => {
            const lowerFilter = filter.toLowerCase();
            if (lowerKey.includes(lowerFilter)) {
              delete results[key];
            }
          });
        });
      }
      // store results in cache
      await kv.set(["cache"], {
        data: results,
        timestamp: Date.now() + cacheTime,
      });
      requestEvent.respondWith(
        new Response(JSON.stringify(results), {
          status: 200,
          headers: new Headers({
            "content-type": "application/json",
          }),
        })
      );
    }
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
    })
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
