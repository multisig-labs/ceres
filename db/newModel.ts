import { utils } from "https://esm.sh/ethers@5.7.2?dts";

import inferType from "../lib/inferType.ts";
import { ReturnedMetric } from "../lib/types.ts";
import { FloatMetric, IntegerMetric, StringMetric } from "./models.ts";

const newModel = (metric: ReturnedMetric) => {
  const type = inferType(metric.value);
  switch (type) {
    case "string": {
      const m = new StringMetric();
      m.name = metric.name;
      m.value = metric.value;
      return m;
    }
    case "number": {
      if (Number.isInteger(metric.value)) {
        const m = new IntegerMetric();
        m.name = metric.name;
        m.value = metric.value;
        return m;
      }
      const m = new FloatMetric();
      m.name = metric.name;
      m.value = metric.value;
      return m;
    }
    case "bigNumber": {
      const m = new FloatMetric();
      m.name = metric.name;
      m.value = parseFloat(utils.formatEther(metric.value));
      return m;
    }
    default: {
      const m = new StringMetric();
      m.name = metric.name;
      m.value = JSON.stringify(metric.value);
      return m;
    }
  }
};

export default newModel;
