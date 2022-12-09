// deno-lint-ignore-file no-explicit-any
import { utils } from "https://cdn.skypack.dev/ethers?dts";

import { Metrics } from "../lib/types.ts";

export default [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "TokenggAVAX",
      method: "totalAssets",
      args: [],
      formatter: (m: Metrics, value: any) => {
        return {
          title: m.metric.title,
          desc: m.metric.desc,
          totalAssets: utils.formatEther(value),
        };
      },
      title: "Total ggAVAX Assets",
      desc: "Total value of assets in the ggAVAX vault",
    },
  } as Metrics,
];
