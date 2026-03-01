// app/api/gscl/route.ts
import { NextResponse } from "next/server";
import { getBaseProvider, getEpochManager } from "../../../lib/epoch-manager";

export const dynamic = "force-dynamic";

function lookbackBlocks() {
  const v = Number(process.env.GSCL_LOOKBACK_BLOCKS ?? "200000");
  return Number.isFinite(v) && v > 0 ? v : 200000;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const strategyId = BigInt(url.searchParams.get("strategyId") ?? "2");

    const provider = getBaseProvider();
    const E = getEpochManager(provider);

    const epochId = (await E.currentEpochId()) as bigint;

    // نبحث في آخر N بلوك لتفادي بطء “من genesis”
    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latest - lookbackBlocks());

    const filter = E.filters.ProofScored(epochId, strategyId);
    const logs = await E.queryFilter(filter, fromBlock, latest);

    if (!logs.length) {
      return NextResponse.json(
        { ok: true, epochId: epochId.toString(), strategyId: strategyId.toString(), found: false },
        { status: 200 }
      );
    }

    const last = logs[logs.length - 1];
    const score = (last.args?.score ?? 0n) as bigint;

    return NextResponse.json(
      {
        ok: true,
        found: true,
        epochId: epochId.toString(),
        strategyId: strategyId.toString(),
        score: score.toString(),
        txHash: last.transactionHash,
        blockNumber: last.blockNumber,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "offline" },
      { status: 200 }
    );
  }
}