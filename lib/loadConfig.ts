interface SourceAuth {
  username: string;
  password: string;
}

export interface Source {
  url: string;
  auth?: SourceAuth;
}

interface ChainConfig {
  name: string;
  chainID: number;
}

interface Sources {
  [key: string]: Source | string;
}

interface DeploymentConfig {
  sources: Sources;
  chain: ChainConfig;
  addresses: Record<string, string>;
  eoaLabels: Record<string, string>;
}

export const DEFAULT_CONFIG_LOCATIONS = {
  contracts: "./config/contracts.json",
  deployment: "./config/deployment.json",
};

export const loadContracts = async (
  contractsPath = DEFAULT_CONFIG_LOCATIONS.contracts,
) => {
  const contractsRaw = await Deno.readTextFile(contractsPath);
  return JSON.parse(contractsRaw);
};

export const loadDeployment = async (
  deploymentPath = DEFAULT_CONFIG_LOCATIONS.deployment,
) => {
  const deploymentRaw = await Deno.readTextFile(deploymentPath);
  return JSON.parse(deploymentRaw) as DeploymentConfig;
};

const loadConfig = async (
  contractsPath = DEFAULT_CONFIG_LOCATIONS.contracts,
  deploymentPath = DEFAULT_CONFIG_LOCATIONS.deployment,
) => {
  const contracts = await loadContracts(contractsPath);
  const deployment = await loadDeployment(deploymentPath);
  return { contracts, deployment };
};

export default loadConfig;
