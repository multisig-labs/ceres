# Adding New Metrics

Adding metrics is a two part process. If you only care about the JSON output, you can skip the second part of the process.

## Adding metric to JSON output

To add a metric, you add what's called a "dashboard" to the dashboards folder. Examples of dashboards and their different types can be found in the [Architecture](ARCHITECTURE.md#dashboards) document.

A file that contains a dashboard should be a `.js` or a `.ts` where the default export is an array of `Metrics` objects. The `Metrics` type can be found in [ `types.ts` ](https://github.com/multisig-labs/ceres/blob/main/lib/types.ts).

The array can either be statically defined or dynamically generated. A good example of a dynamically generated array can be found in the [Rialto Dashboard](https://github.com/multisig-labs/ceres/blob/main/dashboards/rialto.ts) file. The [Rewards Dashboard](https://github.com/multisig-labs/ceres/blob/main/dashboards/rewards.ts) has a good example of a statically defined array.

Once you've defined a dashboard, you should add it to the default export of the [ `index.ts` ](https://github.com/multisig-labs/ceres/blob/main/dashboards/index.ts) file in the dashboards folder.

After this is complete, your metric will run whenever the main script runs. You can test it out with `just run` , which will spit the metrics to stdout. If your metric errors out, it will print the error and display the rest of the metrics.

## Adding metrics to Grafana

There is one more step to add a metric to Grafana. You need to add the JSON metric to the exporter configuration. A relatively up to date example of the metrics config can be found [here](https://github.com/multisig-labs/ceres/blob/main/examples/config/exporter.yml). Once this is done on your local machine, you can run `just up dev` to start the Grafana server and see your metrics.
