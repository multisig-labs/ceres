// deno-lint-ignore-file no-explicit-any
export interface Addresses {
  [key: string]: string;
}

export interface EOALabels {
  [key: string]: string;
}

interface Metric {
  source: string;
  contract?: string;
  body?: any;
  method?: string;
  path?: string;
  args?: any[];
  formatter?: (
    metrics: Metrics,
    value: any,
  ) => ReturnedMetric | Promise<ReturnedMetric>;
  title?: string;
  desc?: string;
  name: string;
  fn?: (...args: any) => any | Promise<any>;
}

export interface ReturnedMetric {
  value: any;
  title?: string;
  desc?: string;
  name: string;
}

export interface Metrics {
  type: "contract" | "rpc" | "rest" | "custom";
  metric: Metric;
}

export interface ReturnedMetrics {
  [key: string]: ReturnedMetric;
}
