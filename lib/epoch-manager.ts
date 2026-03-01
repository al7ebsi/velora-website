// lib/epoch-manager.ts
import { Contract, JsonRpcProvider } from "ethers";
import { EPOCH_MANAGER_ABI } from "./epoch-manager.abi";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function getBaseProvider() {
  // استخدم MAINNET افتراضيًا
  const url = mustEnv("BASE_MAINNET_RPC");
  return new JsonRpcProvider(url);
}

export function getEpochManagerAddress() {
  // من .env.local عندك: EPOCH_MANAGER=0x...
  return mustEnv("EPOCH_MANAGER");
}

export function getEpochManager(provider?: JsonRpcProvider) {
  const p = provider ?? getBaseProvider();
  const addr = getEpochManagerAddress();
  return new Contract(addr, EPOCH_MANAGER_ABI as any, p);
}