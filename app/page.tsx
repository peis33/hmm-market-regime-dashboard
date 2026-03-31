"use client";

import { useState } from "react";
import { predictMarketState } from "@/lib/api";
import { AllocationChart } from "@/components/AllocationChart";
import { InputPanel } from "@/components/InputPanel";
import { MetricBadge } from "@/components/MetricBadge";
import { ResultHero } from "@/components/ResultHero";
import { SectionCard } from "@/components/SectionCard";
import { AnalysisInput, runMockHMMAnalysis } from "@/lib/hmm";

const defaultInput: AnalysisInput = {
  returns: 8.2,
  volatility: 18.6,
  drawdown: -11.4,
};

export default function HomePage() {
  const [input, setInput] = useState<AnalysisInput>(defaultInput);
  const [result, setResult] = useState(() => runMockHMMAnalysis(defaultInput));
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "目前使用分析工作台，按下開始分析後會呼叫 FastAPI /predict。"
  );

  const handleChange = (key: keyof AnalysisInput, value: number) => {
    setInput((prev) => ({
      ...prev,
      [key]: Number.isNaN(value) ? 0 : value,
    }));
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setStatusMessage("正在向 FastAPI /predict 送出分析請求...");

    try {
      const apiResult = await predictMarketState(input);
      setResult(
        apiResult.allocation.length > 0 ? apiResult : runMockHMMAnalysis(input)
      );
      setStatusMessage("已成功取得 /predict 分析結果。");
    } catch {
      setResult(runMockHMMAnalysis(input));
      setStatusMessage("FastAPI 連線失敗，已自動切換為前端 mock data 分析結果。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[size:42px_42px] opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-6 rounded-[36px] border border-white/60 bg-white/70 p-6 shadow-panel backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan">
              HMM Market Lab
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
              HMM 股市分析工作台
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              透過 Hidden Markov Model 的 mock 分析邏輯，快速評估市場狀態、機率與資產配置建議。
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MetricBadge label="Return" value={`${input.returns.toFixed(1)}%`} />
              <MetricBadge
                label="Volatility"
                value={`${input.volatility.toFixed(1)}%`}
              />
              <MetricBadge
                label="Drawdown"
                value={`${input.drawdown.toFixed(1)}%`}
              />
            </div>
          </div>

          <div className="rounded-[30px] bg-gradient-to-br from-ink via-slate-800 to-cyan p-6 text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/65">
              分析提示
            </p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-white/80">
              <p>輸入市場報酬、波動率與最大回撤後，系統會以 mock HMM 狀態機率推估當前 regime。</p>
              <p>介面完全以前端運作，不需後端即可展示分析流程、訊號摘要與配置建議。</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <SectionCard
            title="參數輸入"
            subtitle="調整三項核心指標後，按下「開始分析」更新結果。"
          >
            <InputPanel
              values={input}
              onChange={handleChange}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
            <p className="mt-4 text-sm leading-7 text-slate-500">{statusMessage}</p>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="分析結果" subtitle="根據 mock data 推估的市場 regime">
              <ResultHero result={result} />
            </SectionCard>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <SectionCard title="配置訊號" subtitle="目前模型建議">
                <div className="rounded-3xl bg-mist p-5">
                  <p className="text-sm leading-7 text-slate-600">{result.signal}</p>
                </div>
              </SectionCard>

              <SectionCard title="資產配置" subtitle="Mock allocation output">
                <AllocationChart allocation={result.allocation} />
              </SectionCard>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
