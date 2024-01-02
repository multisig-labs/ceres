import { fetchMetrics } from "./prometheus.ts";

export const ggAVAXCalcAPY = async () => {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 86400000);
  const threeMonthAgo = new Date(now.getTime() - 1.577e7);
  const dayBeforeThreeMonthAgo = new Date(threeMonthAgo.getTime() - 86400000);
  const currentExchange = await fetchMetrics(
    "ggavax_avax_exchange_rate",
    yesterday,
    now,
    "24h"
  );
  const threeMonthAgoExchange = await fetchMetrics(
    "ggavax_avax_exchange_rate offset 90d",
    dayBeforeThreeMonthAgo,
    threeMonthAgo,
    "24h"
  );

  const currentExchangeValue = currentExchange[0][0].value;
  const threeMonthAgoExchangeValue = threeMonthAgoExchange[0][0].value;

  const apy =
    ((currentExchangeValue - threeMonthAgoExchangeValue) /
      Math.abs(threeMonthAgoExchangeValue)) *
    100;
  return apy * -4;
};
