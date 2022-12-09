// deno-lint-ignore-file no-explicit-any
import type { Metrics } from "../lib/types.ts";

const restHandler = (metrics: Metrics, deployment: any): Promise<any> => {
  const metric = metrics.metric;
  if (!metric?.source) throw new Error("Source not found");
  const url = deployment.sources[metric.source] + (metric.path || "");
  if (!url) throw new Error("Source URL not found");
  if (metric?.body) {
    const body = JSON.stringify(metric.body);
    return fetch(url, {
      method: metric.method || "POST",
      body,
    });
  }
  return fetch(url, {
    method: metric.method || "GET",
  });
};

export default restHandler;
