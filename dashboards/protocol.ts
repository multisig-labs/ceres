import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { utils, BigNumber } from "https://cdn.skypack.dev/ethers?dts";

const ProtocolDAODashboard: Metrics[] = [
  {
    type: "contract",
    metric: {
      source: "eth",
      contract: "ProtocolDAO",
      method: "getRewardsEligibilityMinSeconds",
      args: [],
      title: "Rewards Eligibility Min Seconds",
      desc: "The minimum amount of time a user must stake to be eligible for rewards",
      name: "rewardsEligibilityMinSeconds",
      formatter: (m: Metrics, value: BigNumber): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value.toNumber(),
        };
      },
    },
  },
];

export default ProtocolDAODashboard;
