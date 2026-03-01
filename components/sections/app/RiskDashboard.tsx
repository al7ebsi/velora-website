"use client";

import { useEffect, useState } from "react";

export default function RiskDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/risk", { cache: "no-store" })
      .then(r => r.json())
      .then(j => { if (j.ok) setData(j); });
  }, []);

  if (!data) return null;

  return (
    <div className="mt-20 border border-white/10 p-8 rounded-lg bg-black/40">
      <div className="text-xs tracking-widest mb-6 opacity-60">
        RISK METRICS
      </div>

      <div className="grid grid-cols-2 gap-6 text-sm tabular-nums">
        <Metric label="Weekly Drawdown" value={`${data.weeklyDrawdown}%`} />
        <Metric label="Exposure / Pool" value={`${data.exposurePool}%`} />
        <Metric label="Exposure / Chain" value={`${data.exposureChain}%`} />
        <Metric label="Execution Success" value={`${data.execSuccess}%`} />
        <Metric label="Gas Cost Impact" value={`${data.gasCost}%`} />
      </div>
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <div>
      <div className="opacity-50 text-xs mb-1">{label}</div>
      <div className="text-lg">{value}</div>
    </div>
  );
}