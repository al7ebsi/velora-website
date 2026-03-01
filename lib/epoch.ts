// lib/epoch.ts
import { getEpochManager } from "./epoch-manager";

export type EpochData = {
  epochIndex: number;
  epochStart: number;
  epochEnd: number;
  timeLeft: number;
  epochOpen: boolean;
};

export async function getEpochData(): Promise<EpochData> {
  const E = getEpochManager();

  const [id, start, end, left, open] = await Promise.all([
    E.currentEpochId(),
    E.epochStart(),
    E.epochEnd(),
    E.timeLeft(),
    E.epochOpen(),
  ]);

  return {
    epochIndex: Number(id),
    epochStart: Number(start),
    epochEnd: Number(end),
    timeLeft: Number(left),
    epochOpen: Boolean(open),
  };
}