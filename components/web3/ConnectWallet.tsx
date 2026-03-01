"use client";

import { useEffect, useState } from "react";

type EthWindow = Window & { ethereum?: any };

export default function ConnectWallet() {
  const [addr, setAddr] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function connect() {
    setErr(null);
    const eth = (window as EthWindow).ethereum;
    if (!eth) return setErr("No wallet found");
    try {
      const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
      setAddr(accounts?.[0] ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Connect failed");
    }
  }

  useEffect(() => {
    const eth = (window as EthWindow).ethereum;
    if (!eth) return;
    const onAcc = (accounts: string[]) => setAddr(accounts?.[0] ?? null);
    eth.on?.("accountsChanged", onAcc);
    return () => eth.removeListener?.("accountsChanged", onAcc);
  }, []);

  if (addr) {
    return (
      <div className="text-xs opacity-80 tabular-nums">
        {addr.slice(0, 6)}…{addr.slice(-4)}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={connect}
        className="rounded-md border border-white/15 bg-white/[0.03] px-4 py-2 text-xs opacity-90 hover:opacity-100"
      >
        Connect Wallet
      </button>
      {err && <span className="text-xs opacity-60">{err}</span>}
    </div>
  );
}