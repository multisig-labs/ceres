import type { Metrics, ReturnedMetric } from "../lib/types.ts";
import { calculatePercentChange } from "../lib/percentChange.ts";

const metrics = {
	tvlPercentChange: "((total_assets + ignoring(status) (minipools_status_staking * 1000)) * avax_price) + (total_ggp_stake * ggp_price_in_avax * avax_price)",
	liquidStakingPercentChange: "(total_assets / ggavax_avax_exchange_rate) * avax_price",
	ggpPercentChange: "ggp_price_in_avax * avax_price",
	ggpStakePercentChange: "total_ggp_stake * avax_price * ggp_price_in_avax",
	totalMinipoolsPercentChange: "sum(minipools_status_launched) + sum(minipools_status_staking) + sum(minipools_status_prelaunch) + sum(minipools_status_finished) + sum(minipools_status_withdrawable) + sum(minipools_status_cancelled) + sum(minipools_status_error)",
}

interface percentChangeMetric {
  name: string
  title: string
  desc: string
  timeFrame: "week" | "month";
  query: string;
}

// generated by ChatGPT
const percentChangeMetrics: percentChangeMetric[] = [
  {
    name: "tvlPercentChangeMonth",
    title: "TVL Percent Change (Month)",
    desc: "The percent change in TVL over the last month",
    timeFrame: "month",
    query: metrics.tvlPercentChange,
  },
  {
    name: "tvlPercentChangeWeek",
    title: "TVL Percent Change (Week)",
    desc: "The percent change in TVL over the last week",
    timeFrame: "week",
    query: metrics.tvlPercentChange,
  },
  {
    name: "liquidStakingPercentChangeMonth",
    title: "Liquid Staking Percent Change (Month)",
    desc: "The percent change in liquid staking over the last month",
    timeFrame: "month",
    query: metrics.liquidStakingPercentChange,
  },
  {
    name: "liquidStakingPercentChangeWeek",
    title: "Liquid Staking Percent Change (Week)",
    desc: "The percent change in liquid staking over the last week",
    timeFrame: "week",
    query: metrics.liquidStakingPercentChange,
  },
  {
    name: "ggpPercentChangeMonth",
    title: "GGP Percent Change (Month)",
    desc: "The percent change in GGP over the last month",
    timeFrame: "month",
    query: metrics.ggpPercentChange,
  },
  {
    name: "ggpPercentChangeWeek",
    title: "GGP Percent Change (Week)",
    desc: "The percent change in GGP over the last week",
    timeFrame: "week",
    query: metrics.ggpPercentChange,
  },
  {
    name: "ggpStakePercentChangeMonth",
    title: "GGP Stake Percent Change (Month)",
    desc: "The percent change in GGP staked amount over the last month",
    timeFrame: "month",
    query: metrics.ggpStakePercentChange,
  },
  {
    name: "ggpStakePercentChangeWeek",
    title: "GGP Stake Percent Change (Week)",
    desc: "The percent change in GGP staked amount over the last week",
    timeFrame: "week",
    query: metrics.ggpStakePercentChange,
  },
  {
    name: "totalMinipoolsPercentChangeMonth",
    title: "Total Minipools Percent Change (Month)",
    desc: "The percent change in total minipools over the last month",
    timeFrame: "month",
    query: metrics.totalMinipoolsPercentChange,
  },
  {
    name: "totalMinipoolsPercentChangeWeek",
    title: "Total Minipools Percent Change (Week)",
    desc: "The percent change in total minipools over the last week",
    timeFrame: "week",
    query: metrics.totalMinipoolsPercentChange,
  },
]

const PercentChangeDashboard: Metrics[] = percentChangeMetrics.map((m) => {
  return {
    type: "custom",
    metric: {
      source: "prometheus",
      fn: async () => {
        const result = await calculatePercentChange(m.timeFrame, m.query);
        return result;
      },
      args: [],
      title: m.title,
      desc: m.desc,
      name: m.name,
      formatter: (m: Metrics, value: number): ReturnedMetric => {
        return {
          title: m.metric.title,
          desc: m.metric.desc,
          name: m.metric.name,
          value: parseFloat(value.toFixed(2)),
        }
      }
    }
  }
});

export default PercentChangeDashboard;
