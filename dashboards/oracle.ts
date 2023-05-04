import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

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
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "Oracle",
      method: "getGGPPriceInAVAX",
      args: [],
      title: "Last Time GGP Price Updated",
      desc: "The last time the GGP price was updated",
      name: "ggpPriceUpdateTime",
      formatter: (m: Metrics, value: BigNumber[]): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: Number(value[1]),
        };
      },
    },
  },
];

export default OracleDashboard;
