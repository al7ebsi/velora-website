"use client";

import { useEffect, useState } from "react";

export default function ActivityLog() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;

    async function load() {
      const r = await fetch("/api/activity", { cache: "no-store" });
      const j = await r.json();
      if (!alive) return;
      if (j.ok) setRows(j.rows);
    }

    load();
    const t = setInterval(load, 20000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  return (
    <div className="mt-20 border border-white/10 rounded-lg p-6 bg-black/40">
      <div className="text-xs tracking-widest mb-6 opacity-70">
        ON-CHAIN ACTIVITY
      </div>

      <div className="space-y-3 text-xs tabular-nums">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between opacity-80">
            <div>
              {r.type} • Block {r.block}
            </div>
            <div className="opacity-50">
              {r.tx?.slice(0, 8)}...
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}