import { AnalysisResult } from "@/lib/hmm";

type ResultHeroProps = {
  result: AnalysisResult;
};

export function ResultHero({ result }: ResultHeroProps) {
  return (
    <div className="rounded-[28px] bg-ink p-6 text-white">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            市場狀態
          </p>
          <h3 className="mt-3 text-3xl font-bold">{result.regime}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
            {result.summary}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-4">
          <p className="text-sm text-white/65">機率</p>
          <p className="mt-2 text-4xl font-bold">{result.probability}%</p>
        </div>
      </div>
    </div>
  );
}
