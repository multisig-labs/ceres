// deno-lint-ignore-file no-explicit-any
import { utils } from "npm:ethers@5.7.2";

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
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseInt(utils.formatEther(value)),
        };
      },
      title: "Total ggAVAX Assets",
      desc: "Total value of assets in the ggAVAX vault",
      name: "totalAssets",
    },
  } as Metrics,
];
