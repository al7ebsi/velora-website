// components/sections/app/Terminal.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useEpoch } from "../../layout/EpochProvider";
import LockModal from "./LockModal";
import Toast from "./Toast";
import ConnectWallet from "../../web3/ConnectWallet";
import RiskDashboard from "./RiskDashboard";
import CapitalChart from "./CapitalChart";
import ExportPDF from "./ExportPDF";
import ActivityLog from "./ActivityLog";

type GsclView = {
  ok: boolean;
  found?: boolean;
  score?: string; // uint256 string
  epochId?: string;
  strategyId?: string;
  txHash?: string;
};

function tierFromScore01(x: number) {
  if (x >= 0.85) return "Prime";
  if (x >= 0.70) return "Core";
  if (x >= 0.55) return "Watch";
  return "Compression";
}

export default function Terminal() {
  const { s } = useEpoch();

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [g, setG] = useState<GsclView>({ ok: false });

  // اختر الاستراتيجية اللي تبي تعرضها
  const strategyId = 2;

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const r = await fetch(`/api/gscl?strategyId=${strategyId}`, { cache: "no-store" });
        const j = (await r.json()) as any;
        if (!alive) return;
        setG({ ok: !!j.ok, ...j });
      } catch {
        if (!alive) return;
        setG({ ok: false });
      }
    }

    load();
    const t = setInterval(load, 15_000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const gsclScore01 = useMemo(() => {
    // score on-chain عندك uint256 (مش 0.82 مباشرة)
    // إذا أنت فعليًا تخزّنه scaled (مثلاً 1e18) عدّل هنا
    // افتراض: score هو 0..1e18
    const raw = g?.score ? Number(g.score) : NaN;
    if (!Number.isFinite(raw)) return null;
    const v = raw / 1e18;
    return Number.isFinite(v) ? v : null;
  }, [g?.score]);

  const gsclTier = gsclScore01 == null ? "—" : tierFromScore01(gsclScore01);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      {/* Wallet */}
      <div className="flex justify-center mb-10">
        <ConnectWallet />
      </div>

      {/* EPOCH DISPLAY */}
      <div className="mb-16 text-center">
        <div className="text-xs tracking-[0.3em] text-[var(--text-muted)]">
          CURRENT EPOCH
        </div>
        <div className="mt-4 text-6xl tracking-tight text-[var(--titanium)] tabular-nums">
          {s.ok ? s.epochIndex ?? "—" : "—"}
        </div>
      </div>

      {/* GSCL */}
      <div className="mb-16 border border-[var(--border-subtle)] p-10 rounded-lg bg-[var(--bg-elevated)]">
        <div className="text-xs tracking-[0.25em] text-[var(--text-muted)]">
          GSCL SIGNAL (ProofScored)
        </div>

        <div className="mt-6 flex items-center justify-between gap-6">
          <div className="text-4xl text-[var(--text-primary)] tabular-nums">
            {gsclScore01 == null ? "—" : gsclScore01.toFixed(4)}
          </div>

          <div className="text-sm text-[var(--sovereign-gold)]">
            {gsclTier}
          </div>
        </div>

        <div className="mt-4 text-xs opacity-60">
          {g.ok && g.found
            ? `tx: ${String(g.txHash).slice(0, 10)}...`
            : "No ProofScored found (yet) for this epoch."}
        </div>
      </div>

      {/* ACTION */}
      <div className="text-center">
        <button
          onClick={() => setShowModal(true)}
          className="
            border border-[var(--border-strong)]
            text-[var(--sovereign-gold)]
            px-8 py-3 rounded-md tracking-wide transition
            hover:border-[var(--sovereign-gold)] hover:text-white
          "
        >
          Lock Allocation
        </button>
      </div>

      {showModal && (
        <LockModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setToast(true);
            setTimeout(() => setToast(false), 3000);
          }}
        />
      )}
<RiskDashboard />
<CapitalChart />
<ExportPDF />
      {toast && <Toast message="Allocation Locked Successfully" />}
    </section>
  );
}
<ActivityLog />