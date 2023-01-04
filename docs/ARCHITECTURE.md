# Architecture 

The goal is to make a Javascript-based, generic class that could run in Deno that takes as inputs:

* `contracts.json` -- all contract ABIs together in one obj, contract name as key
* `deployment.json` -- all contract addresses, RPC urls, etc
* `dashboard.json` -- description of all variables we want to grab from contracts or URLs

The class would scrape the data, transform it as necessary, and expose the data for Prometheum/Grafana

## `config/contracts.json`

```json
{
  "ContractA": {
    "abi": [ ... ]
  },
  "ContractB": {
    "abi": [ ... ]
  }
}
```

## `config/deployment.json`

```js
{
    // metrics can specify which source URL to use
    sources: {
        eth: {
            url: "https://anr.fly.dev/ext/bc/C/rpc",
            // optional Basic Auth
            username: "",
            password: ""
        },
        ava: "https://anr.fly.dev",
        explorerP: "https://anr.fly.dev/cgi-bin/txp"
    },
    chain: {
        name: "custom",
        chainId: 43112,
    },
    // system will xform addrs to friendly names if found here
    EOALabels: {
        "0xE992bAb78A4901f4AF1C3356a9c6310Da0BA8bee": "nodeOp1"
    },
}
```

## Dashboards

Exports a list of metric objects.

### Contracts

A `metric object` to get contract data is defined as:

```js
{
    type: "contract",
    metric: {
        name: "GetSomeData",
        source: "eth",
        contract: "ContractA",
        method: "getSomeData",
        args: [],
        title: "Some Data",
        desc: "Friendly description",
        formatter: (m, v) => (v) // or name of a defined formatting function
    }
}
```

### JSON RPC

A `metric object` to get some data from an RPC URL.

```js
{
    type: "rpc",
    metric: {
        source: "ava",
        path: "/ext/bc/P",
        method: "platform.getHeight",
        body: {}, // this acts as the params
        title: "Height of Pchain",
        desc: "Friendly description",
        formatter: (m, v) => (v) //or name of a defined formatting function
        name: "rpcObj", // alphanumeric name
    }
}
```

### REST Request

A `metric object` to get some data from a REST URL.

```js
{
    type: "rest",
    metric: {
        name: "restRequest",
        source: "new_source",
        path: "/data",
        method: "post",
        body: {
            start: 0
        }, //only valid on POST and PATCH
        title: "Get data from a REST POST",
        desc: "Lorem ipsum",
        formatter: (m, v) => { // this would also work
            return v.toString()
        }
    }
}
```

### Custom

A `metric object` with a custom method that gets called.

```js
{
    type: "rest",
    metric: {
        name: "restRequest",
        args: ['post', 1, 5.4],
        fn: (...args) => {
            return callAMethodHere(...args);
        },
        title: "Get data from custom method",
        desc: "Lorem ipsum",
        formatter: (m, v) => {
            return v.toString()
        }
    }
}
```

### Formatting info

The formatting function has parameters `m` and `v` , with the types of `Metrics` and `any` respectively. The `Metrics` type can be found in [ `types.ts` ](https://github.com/multisig-labs/ceres/blob/main/lib/types.ts). It is up to the user to determine what the type `v` will be and to format their JSON as needed. An example of a formatter can be found in [ `lib/defaultFormatter.ts` ](https://github.com/multisig-labs/ceres/blob/main/lib/defaultFormatter.ts).

Super-modular to allow for flexibility.

Write a main.js that Deno can run, and the output will be JSON to stdout with all the data we want. Should only need small tweaks. ~~Can use `import c from "./contracts.json" assert { type: "json" };` to get JSON data.~~ Config data is loaded at runtime rather than at compile time. Deno can compile to an exe as well.

~~Write an exporter that takes as input the JSON, and outputs Prometheus formatted data.~~ We are using the [Prometheus JSON Exporter](https://github.com/prometheus-community/json_exporter#json_exporter).

Write a dumper, that takes as input the JSON, and writes to SQLite DB.

Wire it all together with docker-compose.

The prometheus container will pull data on a sched by executing deno run main.js | exporter and Grafana will grab the data from Prom

## Potential Changes

There exists a [JSON Exporter](https://github.com/prometheus-community/json_exporter#json_exporter) already written in Go, and I think we should consider using that rather than writing our own. All we have to do is make the data we are scraping accessible via a simple web server (already done, super simple in Deno) and create a config file for the exporter. Then we just run the exporter on loop every few seconds. If we also want to dump the data into SQL, we can write a simple program to get the data from the JSON server and dump it into a SQLite file.
