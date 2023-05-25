// deno-lint-ignore-file no-explicit-any
import loadConfig, { Source } from "../lib/loadConfig.ts";

const { deployment } = await loadConfig();

export interface PrometheusQueryRangeResponse {
  status: string;
  data: {
    resultType: string;
    result: PrometheusQueryRangeResult[];
  };
}

interface PrometheusQueryRangeResult {
  metric: { [key: string]: string };
  values: [number, string][];
}

const prometheusSource = deployment.sources.prometheus as Source;

const fetchMetrics = async (query: string, start: Date, end: Date) => {
  const PROMETHEUS_URL = prometheusSource.url;
  const PROMETHEUS_USER = prometheusSource?.auth?.username;
  const PROMETHEUS_PASSWORD = prometheusSource?.auth?.password;

  if (!PROMETHEUS_URL || !PROMETHEUS_USER || !PROMETHEUS_PASSWORD) {
    throw new Error(
      "Prometheus source must be configured with url, username, and password",
    );
  }

  const params = new URLSearchParams();
  params.set("query", query);
  params.set("start", Math.floor(start.getTime() / 1000).toString());
  params.set("end", Math.floor(end.getTime() / 1000).toString());
  params.set("step", "12h"); // this may need changed

  const headers = new Headers();
  if (PROMETHEUS_USER && PROMETHEUS_PASSWORD) {
    headers.set(
      "Authorization",
      `Basic ${btoa(`${PROMETHEUS_USER}:${PROMETHEUS_PASSWORD}`)}`,
    );
  }
  const resp = await fetch(`${PROMETHEUS_URL}/api/v1/query_range?${params}`, {
    headers,
    method: "GET",
  });

  if (!resp.ok) {
    const errorResponse = await resp.json() as { error: string } | undefined;
    throw new Error(
      `Prometheus returned ${resp.status}: ${errorResponse?.error}`,
    );
  }

  const data: PrometheusQueryRangeResponse = await resp.json();

  if (data.status !== "success") {
    throw new Error(`Prometheus returned ${data.status}: ${data.data}`);
  }

  // format the data so it only prints out results
  const finalData: any[] = [];
  data.data.result.forEach((result) => {
    const values = result.values.map((value) => {
      try {
        const v = parseFloat(value[1]);
        return { timestamp: value[0], value: v };
      } catch (_e: unknown) {
        // if the value is not a number, just return the value
        return { timestamp: value[0], value: value[1] };
      }
    });
    finalData.push(values);
  });

  return finalData;
};

export const calculatePercentChange = async (timeFrame: "week" | "month", metric: string) => {  			
  // get the start and end dates
  const end = new Date();
  const start = timeFrame === "week" ? new Date(end.getTime() - 604800000) : new Date(end.getTime() - 2592000000);

  const resp = await fetchMetrics(metric, start, end);

  // get the first and last values
  const firstValue = resp[0][0].value;
  const lastValue = resp[0][resp[0].length - 1].value;

  // calculate the percent change
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;

  return percentChange;
}
