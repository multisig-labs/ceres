import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { MINIPOOL_STATUS_MAP } from "../lib/utils/utils.js";
import { BigNumber, utils } from "https://esm.sh/ethers@5.7.2?dts";

const minNodeApr: Metrics = {
  type: "rest",
  metric: {
    source: "gogo-api",
    name: "minNodeApr",
    title: "Minimum Node Apr Value",
    desc: "The minimum APR you will get as a node operator at 10% collateralization",
    path: "/calculator"
    body: {
      ggp
    }
  }

