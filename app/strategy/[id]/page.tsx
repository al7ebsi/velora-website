import { notFound } from "next/navigation";

async function getData(id: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/gscl?strategyId=${id}`, { cache: "no-store" });
  return r.json();
}

export default async function StrategyPage({ params }: any) {
  const data = await getData(params.id);
  if (!data.ok) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <div className="text-xs tracking-widest opacity-60 mb-4">
        STRATEGY {params.id}
      </div>

      <div className="text-4xl tabular-nums">
        Score: {data.score}
      </div>

      <div className="mt-4 opacity-60 text-sm">
        Epoch: {data.epochId}
      </div>
    </div>
  );
}