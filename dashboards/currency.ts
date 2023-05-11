import type { Metrics, ReturnedMetric } from "../lib/types.ts";

type AvaxPrice = {
  price: number;
  lastUpdated: Date;
}

const timeout = 60 * 1000; // 1 requests per minute

const currency: Metrics[] = [
  {
    type: "custom",
    metric: {
      source: "currency",
      title: "AVAX Price",
      name: "avaxPrice",
      desc: "The price of AVAX in USD",
      formatter: (
        m: Metrics,
        value: number
      ): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value,
        };
      },
      args: [],
      fn: async (): Promise<number> => {
        const db = await Deno.openKv();
        const avaxPrice = await db.get<AvaxPrice>(["avaxPrice"]);
        if (avaxPrice?.value && (Date.now() + timeout < avaxPrice.value.lastUpdated.getTime())) {
          return avaxPrice.value.price;
        }

        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd");
        const body = await res.json();
        const price = body["avalanche-2"].usd;
        await db.set(["avaxPrice"], { price, lastUpdated: new Date() });
        return price;
      },
    }
  }
];

export default currency;
