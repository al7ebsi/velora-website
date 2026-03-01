"use client";

export default function CapitalChart() {

  const data = [
    { label: "Liquidity", value: 42 },
    { label: "Arbitrage", value: 28 },
    { label: "Oracle", value: 18 },
    { label: "Neutral", value: 12 },
  ];

  const total = data.reduce((a, b) => a + b.value, 0);

  let cumulative = 0;

  return (
    <div className="mt-20 border border-white/10 p-8 rounded-lg bg-black/40">
      <div className="text-xs tracking-widest mb-6 opacity-60">
        CAPITAL ALLOCATION
      </div>

      <svg viewBox="0 0 200 200" className="w-64 h-64 mx-auto">
        {data.map((d, i) => {
          const start = (cumulative / total) * 360;
          cumulative += d.value;
          const end = (cumulative / total) * 360;

          const largeArc = end - start > 180 ? 1 : 0;

          const x1 = 100 + 100 * Math.cos((Math.PI * start) / 180);
          const y1 = 100 + 100 * Math.sin((Math.PI * start) / 180);

          const x2 = 100 + 100 * Math.cos((Math.PI * end) / 180);
          const y2 = 100 + 100 * Math.sin((Math.PI * end) / 180);

          return (
            <path
              key={i}
              d={`M100 100 L${x1} ${y1} A100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={`hsl(${i * 60}, 60%, 40%)`}
            />
          );
        })}
      </svg>
    </div>
  );
}