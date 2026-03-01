"use client";

import { useEffect, useRef, useState } from "react";

type EpochView = {
  ok: boolean;
  epochIndex?: number;
  epochEnd?: number;
  timeLeft?: number;
};

export default function GlobalStatusBar() {
  const [s, setS] = useState<EpochView>({ ok: false });
  const failures = useRef(0);
  const lastGood = useRef<EpochView | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const r = await fetch("/api/epoch", { cache: "no-store" });
        const j = (await r.json()) as any;

        if (!alive) return;

        if (j?.ok) {
          failures.current = 0;
          const next = { ok: true, epochIndex: j.epochIndex, epochEnd: j.epochEnd, timeLeft: j.timeLeft };
          lastGood.current = next;
          setS(next);
          return;
        }

        // server رجع ok=false
        failures.current += 1;
        if (failures.current >= 3) setS({ ok: false, ...lastGood.current });
      } catch {
        if (!alive) return;
        failures.current += 1;
        if (failures.current >= 3) setS({ ok: false, ...lastGood.current });
      }
    }

    load();
    const t = setInterval(load, 15_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return (
    <div className="border-b border-white/10 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-xs">
        <div className="flex items-center gap-2 opacity-80">
          <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? "bg-white/70" : "bg-white/20"}`} />
          <span>{s.ok ? "Live protocol feed" : "Offline mode"}</span>
        </div>

        <div className="flex items-center gap-4 opacity-75 tabular-nums">
          <span>Epoch: {s.epochIndex ?? "—"}</span>
          <span>Time left: {formatTime(s.timeLeft)}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(sec?: number) {
  if (!sec || sec <= 0) return "—";
  const s = Math.floor(sec);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}