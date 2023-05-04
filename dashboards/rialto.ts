import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";
import loadConfig from "../lib/loadConfig.ts";

const { deployment } = await loadConfig();

const NETWORK_ADDR = deployment.sources.ava;
const RIALTO_C_CHAIN_ADDR = deployment.addresses.RialtoCChain;
const RIALTO_P_CHAIN_ADDR = deployment.addresses.RialtoPChain;

const capitalize = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const participants = Object.keys(deployment.sources).filter((name: string) => {
  return name.startsWith("rialto-");
}).map((name: string) => {
  return name.replace("rialto-", "");
});

const rialtoUp: Metrics[] = participants.map((
  name: string,
) => (
  {
    type: "rest",
    metric: {
      source: `rialto-${name}`,
      path: "/",
      title: `Rialto ${capitalize(name)} Up`,
      desc: `Whether or not Rialto ${capitalize(name)} is up`,
      name: `Rialto${capitalize(name)}Up`,
      formatter: (
        m: Metrics,
        value: Response | null,
      ): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value?.status === 200 ? 1 : 0,
        };
      },
    },
  }
));

const rialtoQuorum: Metrics[] = participants.map((name: string) => {
  return {
    type: "rest",
    metric: {
      source: `rialto-${name}`,
      path: "/info",
      title: `Rialto ${capitalize(name)} Quorum`,
      desc: `Whether or not Rialto ${capitalize(name)} is in quorum`,
      name: `Rialto${capitalize(name)}Quorum`,
      formatter: async (
        m: Metrics,
        value: Response | null,
      ): Promise<ReturnedMetric> => {
        if (!value) {
          return {
            name: m.metric.name,
            title: m.metric.title,
            desc: m.metric.desc,
            value: 0,
          };
        }

        const body = await value.json();
        const quorum = body?.Quorum ? 1 : 0;
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: quorum,
        };
      },
    },
  };
});

const rialtoVersion: Metrics[] = participants.map((name: string) => {
  return {
    type: "rest",
    metric: {
      source: `rialto-${name}`,
      path: "/info",
      title: `Rialto ${capitalize(name)} Version`,
      desc: `Version of Rialto ${capitalize(name)}`,
      name: `Rialto${capitalize(name)}Version`,
      formatter: async (
        m: Metrics,
        value: Response | null,
      ): Promise<ReturnedMetric> => {
        if (!value) {
          return {
            name: m.metric.name,
            title: m.metric.title,
            desc: m.metric.desc,
            value: 0,
          };
        }

        const body = await value.json();
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: body?.Version,
        };
      },
    },
  };
});

const RialtoDashboard: Metrics[] = [
  ...rialtoUp,
  ...rialtoQuorum,
  ...rialtoVersion,
  {
    type: "rest",
    metric: {
      source: "rialto-john",
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
  // convert to REST type
  {
    type: "custom",
    metric: {
      source: "rialto",
      name: "PBalance",
      title: "Rialto P-Chain Balance",
      desc: "Balance of the Rialto P-Chain account",
      formatter: (m: Metrics, value: number): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value,
        };
      },
      args: [],
      fn: async (): Promise<number> => {
        const data = {
          jsonrpc: "2.0",
          id: 1,
          method: "platform.getBalance",
          params: {
            addresses: [RIALTO_P_CHAIN_ADDR],
          },
        };

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        const response = await fetch(NETWORK_ADDR + "/ext/bc/P", options);
        const body = await response.json();
        const balance = parseInt(body?.result?.balance);
        return balance * (10 ** -9);
      },
    },
  },
  {
    type: "custom",
    metric: {
      source: "rialto",
      name: "CBalance",
      title: "Rialto C-Chain Balance",
      desc: "Balance of the Rialto C-Chain account",
      formatter: (m: Metrics, value: number): ReturnedMetric => {
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: value,
        };
      },
      args: [],
      fn: async (): Promise<number> => {
        const data = {
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [RIALTO_C_CHAIN_ADDR, "latest"],
        };

        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        const response = await fetch(NETWORK_ADDR + "/ext/bc/C/rpc", options);
        const body = await response.json();
        const balance = BigNumber.from(body?.result);
        return parseFloat(utils.formatEther(balance));
      },
    },
  },
];

export default RialtoDashboard;
