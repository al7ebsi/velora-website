import { NextResponse } from "next/server";
import { getEpochManager } from "../../../lib/epoch-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const E = getEpochManager();
    const epochId = await E.currentEpochId();

    const strategyId = 2n;

    const m = await E.riskMetrics(epochId, strategyId);

    return NextResponse.json({
      ok: true,
      epochId: epochId.toString(),
      strategyId: strategyId.toString(),
      weeklyDrawdown: Number(m.weeklyDrawdownBps) / 100,
      exposurePool: Number(m.exposurePerPoolBps) / 100,
      exposureChain: Number(m.exposurePerChainBps) / 100,
      execSuccess: Number(m.execSuccessBps) / 100,
      gasCost: Number(m.gasCostBps) / 100,
      breachDrawdown: m.breachDrawdown,
      breachExposure: m.breachExposure,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}