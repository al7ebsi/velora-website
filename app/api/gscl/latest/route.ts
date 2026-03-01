import { NextResponse } from "next/server";
import { getEpochManager } from "../../../../lib/epoch-manager";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const E = getEpochManager();

    // آخر ~20,000 بلوك (عدلها لاحقاً)
    const latest = await E.provider.getBlockNumber();
    const from = Math.max(0, latest - 20_000);

    const logs = await E.queryFilter(E.filters.ProofScored(), from, latest);
    const last = logs.at(-1);

    if (!last) {
      return NextResponse.json({ ok: true, found: false }, { status: 200 });
    }

    const { epochId, strategyId, score } = (last.args as any);
    return NextResponse.json(
      {
        ok: true,
        found: true,
        epochId: Number(epochId),
        strategyId: Number(strategyId),
        score: score.toString(), // uint256
        txHash: last.transactionHash,
        blockNumber: last.blockNumber,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "rpc_error" }, { status: 200 });
  }
}