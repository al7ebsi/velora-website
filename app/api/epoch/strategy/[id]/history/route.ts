import { NextResponse } from "next/server";
import { Interface } from "ethers";
import { getBaseProvider } from "../../../../../lib/epoch-manager";
import { EPOCH_MANAGER_ABI } from "../../../../../lib/epoch-manager.abi";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const strategyId = Number(params.id);
    if (!Number.isFinite(strategyId)) {
      return NextResponse.json({ ok: false, error: "bad strategy id" }, { status: 400 });
    }

    const provider = getBaseProvider();
    const epochManager = process.env.EPOCH_MANAGER!;
    const iface = new Interface(EPOCH_MANAGER_ABI as any);

    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(0, latest - 120_000); // أوسع شوي للهستوري

    const eventFrag = iface.getEvent("ProofScored");
    const topic0 = eventFrag.topicHash;
    const topicStrategy = iface.encodeFilterTopics(eventFrag, [null, strategyId])[1];

    const logs = await provider.getLogs({
      address: epochManager,
      fromBlock,
      toBlock: latest,
      topics: [topic0, null, topicStrategy],
    });

    const rows = logs.map((log) => {
      const parsed = iface.parseLog(log);
      return {
        epochId: Number(parsed.args.epochId),
        strategyId: Number(parsed.args.strategyId),
        score: parsed.args.score.toString(),
        blockNumber: log.blockNumber,
        txHash: log.transactionHash,
      };
    }).sort((a, b) => b.blockNumber - a.blockNumber);

    return NextResponse.json({ ok: true, source: "onchain:ProofScored", fromBlock, toBlock: latest, rows }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "offline", rows: [] }, { status: 200 });
  }
}