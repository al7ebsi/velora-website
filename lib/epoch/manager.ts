import { Contract, JsonRpcProvider } from "ethers";
import { EPOCH_MANAGER_ABI } from "./epoch-manager.abi";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getBaseProvider() {
  return new JsonRpcProvider(mustEnv("BASE_MAINNET_RPC"));
}

export function getEpochManager() {
  const addr = mustEnv("EPOCH_MANAGER");
  const provider = getBaseProvider();
  return new Contract(addr, EPOCH_MANAGER_ABI, provider);
}