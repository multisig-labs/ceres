import type { Metrics, ReturnedMetric } from "../lib/types.ts";

const minNodeApr: Metrics = {
  type: "rest",
  metric: {
    method: "GET",
    source: "gogo-api",
    name: "minNodeApr",
    title: "Minimum Node Apr Value",
    desc: "The minimum APR you will get as a node operator at 10% collateralization",
    path: "/nodeOpSpread",
    formatter: async (
      m: Metrics,
      value: Response,
    ): Promise<ReturnedMetric> => {
      // get the raw body of the response
      const body = await value.json();
      return {
        name: m.metric.name,
        title: m.metric.title,
        desc: m.metric.desc,
        value: body.min.apy,
      };
    }
  }
}

const maxNodeApr: Metrics = {
  type: "rest",
  metric: {
    method: "GET",
    source: "gogo-api",
    name: "maxNodeApr",
    title: "Maximum Node Apr Value",
    desc: "The maximum APR you will get as a node operator at 150% collateralization",
    path: "/nodeOpSpread",
    formatter: async (
      m: Metrics,
      value: Response,
    ): Promise<ReturnedMetric> => {
      const body = await value.json();
      return {
        name: m.metric.name,
        title: m.metric.title,
        desc: m.metric.desc,
        value: body.max.apy,
      };
    },
  }
}

export default [minNodeApr, maxNodeApr]
