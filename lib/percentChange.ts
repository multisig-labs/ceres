import { fetchMetrics } from "./prometheus.ts";

export const calculatePercentChange = async (
  timeFrame: "week" | "month",
  metric: string
) => {
  // get the start and end dates
  const end = new Date();
  const start =
    timeFrame === "week"
      ? new Date(end.getTime() - 604800000)
      : new Date(end.getTime() - 2592000000);

  const resp = await fetchMetrics(metric, start, end);

  // get the first and last values
  const firstValue = resp[0][0].value;
  const lastValue = resp[0][resp[0].length - 1].value;

  // calculate the percent change
  const percentChange = ((lastValue - firstValue) / firstValue) * 100;

  return percentChange;
};
