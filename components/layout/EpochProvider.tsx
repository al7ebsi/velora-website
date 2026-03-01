// components/layout/EpochProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type EpochView = {
  ok: boolean;
  epochIndex?: number;
  epochEnd?: number;
  epochStart?: number;
  timeLeft?: number;
  epochOpen?: boolean;
  error?: string;
};

type Ctx = { s: EpochView };

const EpochContext = createContext<Ctx | null>(null);

export function EpochProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<EpochView>({ ok: false });
  const [lastGoodAt, setLastGoodAt] = useState<number>(0);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const r = await fetch("/api/epoch", { cache: "no-store" });
        const j = await r.json();

        if (!alive) return;

        if (j?.ok) {
          setLastGoodAt(Date.now());
          setS({
            ok: true,
            epochIndex: j.epochIndex,
            epochEnd: j.epochEnd,
            epochStart: j.epochStart,
            timeLeft: j.timeLeft,
            epochOpen: j.epochOpen,
          });
        } else {
          // لا تقلب Offline مباشرة إذا عندك نجاح قريب
          const stillLive = Date.now() - lastGoodAt < 60_000;
          setS((prev) => ({
            ...prev,
            ok: stillLive,
            error: j?.error ?? "offline",
          }));
        }
      } catch (e: any) {
        if (!alive) return;
        const stillLive = Date.now() - lastGoodAt < 60_000;
        setS((prev) => ({
          ...prev,
          ok: stillLive,
          error: e?.message ?? "offline",
        }));
      }
    }

    load();
    const t = setInterval(load, 15_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [lastGoodAt]);

  const value = useMemo(() => ({ s }), [s]);
  return <EpochContext.Provider value={value}>{children}</EpochContext.Provider>;
}

export function useEpoch() {
  const ctx = useContext(EpochContext);
  if (!ctx) throw new Error("useEpoch must be used inside EpochProvider");
  return ctx;
}