# Architecture 

The goal is to make a Javascript-based, generic class that could run in Deno that takes as inputs:

* `contracts.json` -- all contract ABIs together in one obj, contract name as key
* `deployment.json` -- all contract addresses, RPC urls, etc
* `dashboard.json` -- description of all variables we want to grab from contracts or URLs

The class would scrape the data, transform it as necessary, and expose the data for Prometheum/Grafana

## `contracts.json`

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

## `deployment.json`

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

## `dashboard.js`

Exports a list of metric objects.

A `metric object` to get contract data is defined as:

```js
{
    type: "contract",
    metric: {
        source: "eth",
        contract: "ContractA",
        method: "getSomeData",
        args: [],
        title: "Some Data",
        desc: "Friendly description",
        formatter: (v) => (v) // or name of a defined formatting function,
    }
}
```

A `metric object` to get some data from an RPC URL.

```js
{
    type: "rpc",
    metric: {
        source: "ava",
        path: "/ext/bc/P",
        method: "platform.getHeight",
        args: [],
        title: "Height of Pchain",
        desc: "Friendly description",
        formatter: (v) => (v) //or name of a defined formatting function,
    }
}
```

A `metric object` to get some data from a REST URL.

```js
{

    type: "rest",
    metric: {
        source: "new_source",
        path: "/data",
        method: "post",
        body: {start: 0}, //only valid on POST and PATCH
        args: [], // act as query args
        title: "Get data from a REST POST",
        desc: "Lorem ipsum",
        formatter: (v) => { // this would also work
            return v.toString()
        }
    }

}
