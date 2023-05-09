import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";
import YAML from "https://esm.sh/yaml@2.2.2";
import { Metrics } from "../lib/types.ts";
import dashboards from "../dashboards/index.ts";

interface MetricObj {
  name: string;
  path: string;
  help?: string;
  labels?: Record<string, string>;
}

const flags = parse(Deno.args, {
  string: ["path", "ignore"],
  default: {
    path: "",
    ignore: "",
  },
});

function camelToSnakeCase(str: string): string {
  return str.replace(/([a-z])([A-Z]+)/g, (_match, p1, p2) => `${p1}_${p2.toLowerCase()}`).replace(
    /^_/,
    "",
  );
}

function metricsToYAML(metricsList: Metrics[]): string {
  const yamlObj = {
    modules: {
      default: {
        metrics: metricsList.map((metric) => {
          const metricObj: MetricObj = {
            name: camelToSnakeCase(metric.metric.name),
            path: `{ .${metric.metric.name}.value }`,
          };

          if (metric.metric.labels) {
            metricObj.labels = metric.metric.labels;
          }

          if (metric.metric.desc) {
            metricObj.help = metric.metric.desc;
          }

          return metricObj;
        }),
      },
    },
  };

  return YAML.stringify(yamlObj);
}

const metrics = dashboards.reduce((acc, curr) => [...acc, ...curr], []);

const yamlData = metricsToYAML(metrics.filter((metric) => {
  // ignore is a regex string
  if (flags.ignore) {
    const regex = new RegExp(flags.ignore);
    return !regex.test(metric.metric.name);
  }
  return !metric.metric.ignore;
}));

if (flags.path) {
  Deno.writeTextFileSync(flags.path, yamlData);
} else console.log(yamlData);
