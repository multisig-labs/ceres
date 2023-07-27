import { google } from "npm:googleapis@122.0.0";
import type { Metrics, ReturnedMetric } from "../lib/types.ts";

async function getData(query: string) {
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    keyFile: Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS")!,
  });

  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: Deno.env.get("SHEET_ID")!,
    range: query,
  });

  return response.data.values;
}

const data: Metrics[] = [
  {
    type: "custom",
    metric: {
      source: "currency",
      title: "Circulating Supply",
      name: "circulatingSupply",
      desc: "The circulating supply of AVAX",
      formatter: (m: Metrics, value: string): ReturnedMetric => {
        value = value.replace(/,/g, "");
        return {
          name: m.metric.name,
          title: m.metric.title,
          desc: m.metric.desc,
          value: parseFloat(value),
        };
      },
      args: [],
      fn: async (): Promise<number> => {
        const res = await getData("A22");
        const circulatingSupply = res?.[0]?.[0] || 0;
        return circulatingSupply;
      },
    },
  },
];

export default data;
