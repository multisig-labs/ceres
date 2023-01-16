import type { Metrics, ReturnedMetric } from "../lib/types.ts";

const RialtoDashboard: Metrics[] = [
  {
    type: "rest",
    metric: {
      source: "rialto",
      path: "/info",
      title: "Rialto Online Peers",
      desc: "Number of online peers on the Rialto network",
      name: "rialtoPeers",
      formatter: async (
        m: Metrics,
        value: Response,
      ): Promise<ReturnedMetric> => {
        // get the body of the response
        const body = await value.json();
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: body?.OnlineParticipants?.length,
        };
      },
    },
  },
];

export default RialtoDashboard;
