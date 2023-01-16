import type { Metrics, ReturnedMetric } from "../lib/types.ts";

const OrcDashboard: Metrics[] = [
  {
    type: "rest",
    metric: {
      source: "orc",
      path: "/",
      title: "Orc Online",
      desc: "Checks if the Orchestrator node is online",
      name: "orcOnline",
      formatter: async (
        m: Metrics,
        value: Response,
      ): Promise<ReturnedMetric> => {
        // get the raw body of the response
        const body = await value.text();
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: body === "ok",
        };
      },
    },
  },
];

export default OrcDashboard;
