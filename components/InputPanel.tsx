"use client";

import { AnalysisInput } from "@/lib/hmm";

type InputPanelProps = {
  values: AnalysisInput;
  onChange: (key: keyof AnalysisInput, value: number) => void;
  onAnalyze: () => void;
  isLoading?: boolean;
};

const fields = [
  {
    key: "returns" as const,
    label: "Return",
    helper: "預期報酬率（%）",
    min: -20,
    max: 20,
    step: 0.1,
  },
  {
    key: "volatility" as const,
    label: "Volatility",
    helper: "年化波動率（%）",
    min: 0,
    max: 50,
    step: 0.1,
  },
  {
    key: "drawdown" as const,
    label: "Drawdown",
    helper: "最大回撤（%）",
    min: -40,
    max: 0,
    step: 0.1,
  },
];

export function InputPanel({
  values,
  onChange,
  onAnalyze,
  isLoading = false,
}: InputPanelProps) {
  return (
    <div className="space-y-5">
      {fields.map((field) => (
        <label key={field.key} className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{field.label}</span>
            <span className="text-sm text-slate-500">{field.helper}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.key]}
              onChange={(event) =>
                onChange(field.key, Number(event.target.value))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-cyan"
            />
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={values[field.key]}
              onChange={(event) =>
                onChange(field.key, Number(event.target.value))
              }
              className="w-28 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm text-ink outline-none transition focus:border-cyan focus:bg-white"
            />
          </div>
        </label>
      ))}

      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-ink px-5 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-900"
      >
        {isLoading ? "分析中..." : "開始分析"}
      </button>
    </div>
  );
}
