// deno-lint-ignore-file no-explicit-any
import type { Metrics } from "../lib/types.ts";

const rpcHandler = async (metrics: Metrics, deployment: any) => {
  const metric = metrics.metric;
  if (!metric?.source) throw new Error("Source not found");
  const url = deployment.sources[metric.source];
  if (!url) throw new Error("Source URL not found");
  const body = JSON.stringify({
    jsonrpc: "2.0",
    method: metric.method,
    params: metric.body || {},
    id: 1,
  });
  const resp = await fetch(url, {
    method: "POST",
    body,
  });
  const data = await resp.json();
  return data.result;
};

export default rpcHandler;
