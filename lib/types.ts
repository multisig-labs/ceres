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
  method: string;
  path?: string;
  args: any[];
  formatter: (value: any) => string;
  title: string;
  desc: string;
}

export interface Metrics {
  type: "contract" | "rpc" | "rest";
  metric: Metric;
}
