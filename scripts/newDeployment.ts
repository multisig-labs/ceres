import type { Addresses, EOALabels } from "../lib/types.ts";

const generateDeployment = (
  avaURL: string,
  orcURL: string,
  chainName: string,
  chainID: number,
  addresses: Addresses,
  eoaLabels: EOALabels
) => {
  return {
    sources: {
      ava: avaURL,
      eth: avaURL + "/ext/bc/C/rpc",
      orc: {
        url: orcURL,
      },
      chain: {
        name: chainName,
        chainID,
      },
      addresses,
      eoaLabels,
    },
  };
};

const avaURL = prompt("Enter the Avalanche URL: ");
const orcURL = prompt("Enter the Orchestrator URL: ");
const chainName = prompt("Enter the chain name: ");
const chainID = parseInt(prompt("Enter the chain ID: ")!);
const nOfAddresses = parseInt(prompt("Enter the number of addresses: ") || "0");
const addresses: Addresses = {};
for (let i = 0; i < nOfAddresses; i++) {
  const address = prompt(`Enter address ${i}: `);
  const name = prompt(`Enter name for address ${i}: `);
  addresses[address!] = name!;
}

const nOfEOALabels = parseInt(
  prompt("Enter the number of EOA labels: ") || "0"
);
const eoaLabels: EOALabels = {};
for (let i = 0; i < nOfEOALabels; i++) {
  const address = prompt(`Enter EOA address ${i}: `);
  const label = prompt(`Enter label for EOA address ${i}: `);
  eoaLabels[address!] = label!;
}

const deployment = generateDeployment(
  avaURL!,
  orcURL!,
  chainName!,
  chainID,
  addresses,
  eoaLabels
);

await Deno.writeTextFile("./data/deployment.json", JSON.stringify(deployment));
