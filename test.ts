const body =
  '{"method":"eth_call","params":[{"to":"0x3f1f12b672cea8d9f798b43af57fbe4ad9cbf8bd","data":"0xad71bd3600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"},"latest"],"id":42,"jsonrpc":"2.0"}';

const rpcURL = "https://anr.fly.dev/ext/bc/C/rpc";

const response = await fetch(rpcURL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body,
});

const json = await response.json();

console.log(json);
console.log(json.result.length);
