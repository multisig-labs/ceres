import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";
import { Contract, providers, utils } from "https://esm.sh/ethers@5.7.2?dts";
import loadConfig from "../lib/loadConfig.ts";

// if any new contracts are needed, add them to this list
const FETCH_CONTRACTS_NAMES = [
  "ClaimNodeOp",
  "ClaimProtocolDAO",
  "MinipoolManager",
  "MultisigManager",
  "Ocyticus",
  "Oracle",
  "ProtocolDAO",
  "RewardsPool",
  "Staking",
  "Vault",
  "TokenGGP",
  "TokenggAVAX",
];

const flags = parse(Deno.args, {
  string: ["storageAddr", "rpcURL", "chainID"],
  alias: {
    storageAddr: "a",
    rpcURL: "u",
    chainID: "i",
  },
});

const { storageAddr, rpcURL, chainID } = flags;

if (!storageAddr) {
  throw new Error("Storage address not found");
}

if (!rpcURL) {
  throw new Error("RPC URL not found");
}

if (!chainID) {
  throw new Error("Chain ID not found");
}

console.log("Fetching addresses from storage contract: ", storageAddr);
console.log("Using RPC URL: ", rpcURL);

const { contracts } = await loadConfig();

const provider = new providers.StaticJsonRpcProvider(
  rpcURL,
  parseInt(chainID),
);

const abi = contracts?.Storage?.abi;

if (!abi) {
  throw new Error("Contract ABI not found");
}

const storageContract = new Contract(storageAddr, abi, provider);

const addresses = FETCH_CONTRACTS_NAMES.map(async (key) => {
  try {
    const args = utils.solidityKeccak256(["string", "string"], [
      "contract.address",
      key,
    ]);
    const resp = await storageContract.getAddress(args);
    if (resp as string === "0x0000000000000000000000000000000000000000") {
      throw new Error("Address not found");
    }
    return { key, addr: resp };
  } catch (e) {
    console.log("Error fetching address for key: ", key);
    console.error(e);
    return null;
  }
});

const result = await Promise.all(addresses);

// for each key in the list of key and address pars, make the key the key and the address the value
const addressesObj = result.reduce((acc, curr) => {
  if (curr) {
    // @ts-ignore: Constructs a new object with the same keys as the object passed in
    acc[curr.key] = curr.addr;
  }
  return acc;
}, {});

// @ts-ignore: Add storage address to the object
addressesObj["Storage"] = storageAddr;

console.log(addressesObj);
