// deno-lint-ignore-file no-explicit-any
import type { Metrics } from "../lib/types.ts";
import fetchWithTimeout from "https://gist.githubusercontent.com/chand1012/43c187e650cc1fc3775f296817053f97/raw/8ae560a97f67d82daeb4f2cb37aaacd501dfc08e/fetchWithTimeout.ts";

const restHandler = (metrics: Metrics, deployment: any): Promise<any> => {
  const metric = metrics.metric;
  if (!metric?.source) throw new Error("Source not found");
  if (!deployment.sources[metric.source]) throw new Error("Source not found");
  const baseURL = (deployment.sources[metric.source]?.url ||
    deployment.sources[metric.source]) as string;
  const url = baseURL + (metric?.path || "");
  if (!url) throw new Error("Source URL not found");
  const headers: { Authorization?: string } = {};
  if (deployment.sources[metric.source]?.auth) {
    // auth will have a username and a password for http basic auth
    const username = deployment.sources[metric.source]?.auth
      ?.username as string;
    const password = deployment.sources[metric.source]?.auth
      ?.password as string;
    const auth = btoa(`${username}:${password}`);
    headers["Authorization"] = `Basic ${auth}`;
  }
  if (metric?.body) {
    const body = JSON.stringify(metric.body);
    return fetchWithTimeout(url, {
      method: metric?.method || "POST",
      headers,
      body,
    });
  }
  try {
    return fetchWithTimeout(url, {
      method: metric?.method || "GET",
      headers,
    });
  } catch (e) {
    console.error(e);
    return Promise.resolve(null);
  }
};

export default restHandler;
