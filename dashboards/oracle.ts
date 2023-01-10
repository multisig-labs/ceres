import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { utils, BigNumber } from "npm:ethers@5.7.2";

const OracleDashboard: Metrics[] = [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "Oracle",
      method: "getGGPPriceInAVAX",
      args: [],
      title: "GGP Price in AVAX",
      desc: "The price of GGP in AVAX",
      name: "ggpPriceInAVAX",
      formatter: (m: Metrics, value: BigNumber[]): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: Number(utils.formatEther(value[0])),
        };
      },
    },
  },
];

export default OracleDashboard;
