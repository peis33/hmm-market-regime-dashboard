export type AnalysisInput = {
  returns: number;
  volatility: number;
  drawdown: number;
};

export type Allocation = {
  name: string;
  value: number;
};

export type AnalysisResult = {
  regime: string;
  probability: number;
  summary: string;
  signal: string;
  allocation: Allocation[];
};

export type PredictApiResponse = {
  market_regime?: string;
  market_state?: string;
  regime?: string;
  probability?: number;
  regime_probabilities?: Record<string, number>;
  summary?: string;
  signal?: string;
  allocation?: Allocation[];
  asset_allocation?: Allocation[];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function runMockHMMAnalysis(input: AnalysisInput): AnalysisResult {
  const normalizedReturn = clamp((input.returns + 15) / 30, 0, 1);
  const normalizedVolatility = clamp(input.volatility / 40, 0, 1);
  const normalizedDrawdown = clamp(Math.abs(input.drawdown) / 35, 0, 1);

  const bullScore =
    normalizedReturn * 0.62 +
    (1 - normalizedVolatility) * 0.23 +
    (1 - normalizedDrawdown) * 0.15;

  const bearScore =
    (1 - normalizedReturn) * 0.28 +
    normalizedVolatility * 0.34 +
    normalizedDrawdown * 0.38;

  const sidewayScore =
    (1 - Math.abs(normalizedReturn - 0.5) * 2) * 0.45 +
    (1 - Math.abs(normalizedVolatility - 0.45) * 1.6) * 0.3 +
    (1 - Math.abs(normalizedDrawdown - 0.3) * 1.4) * 0.25;

  const states = [
    { key: "bull", label: "\u591a\u982d\u64f4\u5f35", score: bullScore },
    { key: "sideway", label: "\u76e4\u6574\u89c0\u671b", score: sidewayScore },
    { key: "bear", label: "\u7a7a\u982d\u9632\u79a6", score: bearScore },
  ].sort((a, b) => b.score - a.score);

  const top = states[0];
  const probability = clamp(55 + (top.score - states[1].score) * 100, 56, 94);

  const allocationMap: Record<string, Allocation[]> = {
    bull: [
      { name: "\u80a1\u7968\u578b\u8cc7\u7522", value: 70 },
      { name: "\u50b5\u5238\u578b\u8cc7\u7522", value: 15 },
      { name: "\u73fe\u91d1", value: 15 },
    ],
    sideway: [
      { name: "\u80a1\u7968\u578b\u8cc7\u7522", value: 45 },
      { name: "\u50b5\u5238\u578b\u8cc7\u7522", value: 30 },
      { name: "\u73fe\u91d1", value: 25 },
    ],
    bear: [
      { name: "\u80a1\u7968\u578b\u8cc7\u7522", value: 20 },
      { name: "\u50b5\u5238\u578b\u8cc7\u7522", value: 40 },
      { name: "\u73fe\u91d1", value: 40 },
    ],
  };

  const summaryMap: Record<string, string> = {
    bull: "\u5831\u916c\u52d5\u80fd\u5f37\u3001\u6ce2\u52d5\u8207\u56de\u64a4\u53d7\u63a7\uff0c\u6a21\u578b\u504f\u5411\u98a8\u96aa\u8cc7\u7522\u64f4\u5f35\u3002",
    sideway:
      "\u5831\u916c\u8a0a\u865f\u4e0d\u5920\u96c6\u4e2d\uff0c\u5e02\u5834\u53ef\u80fd\u5728\u5340\u9593\u5167\u53cd\u8986\u6e2c\u8a66\u65b9\u5411\u3002",
    bear: "\u6ce2\u52d5\u8207\u56de\u64a4\u58d3\u529b\u504f\u9ad8\uff0c\u6a21\u578b\u5efa\u8b70\u5148\u63d0\u9ad8\u9632\u79a6\u90e8\u4f4d\u3002",
  };

  const signalMap: Record<string, string> = {
    bull: "\u504f\u591a\u914d\u7f6e\uff0c\u53ef\u9010\u6b65\u52a0\u78bc\u6210\u9577\u578b\u90e8\u4f4d\u3002",
    sideway:
      "\u4e2d\u6027\u914d\u7f6e\uff0c\u4fdd\u7559\u5f48\u6027\u7b49\u5f85\u66f4\u660e\u78ba\u8da8\u52e2\u3002",
    bear: "\u504f\u4fdd\u5b88\u914d\u7f6e\uff0c\u512a\u5148\u63a7\u7ba1\u98a8\u96aa\u8207\u6d41\u52d5\u6027\u3002",
  };

  return {
    regime: top.label,
    probability: Number(probability.toFixed(1)),
    summary: summaryMap[top.key],
    signal: signalMap[top.key],
    allocation: allocationMap[top.key],
  };
}

export function normalizePredictResponse(
  payload: PredictApiResponse
): AnalysisResult {
  const normalizedRegime =
    payload.market_regime ??
    payload.market_state ??
    payload.regime ??
    "\u672a\u77e5\u72c0\u614b";

  const normalizedProbability =
    payload.probability ??
    (normalizedRegime !== "\u672a\u77e5\u72c0\u614b" && payload.regime_probabilities
      ? payload.regime_probabilities[normalizedRegime]
      : 0);

  return {
    regime: normalizedRegime,
    probability: Number(normalizedProbability.toFixed(1)),
    summary:
      payload.summary ?? "\u76ee\u524d\u5f8c\u7aef\u672a\u63d0\u4f9b\u5206\u6790\u6458\u8981\u3002",
    signal:
      payload.signal ?? "\u76ee\u524d\u5f8c\u7aef\u672a\u63d0\u4f9b\u914d\u7f6e\u8a0a\u865f\u3002",
    allocation: payload.allocation ?? payload.asset_allocation ?? [],
  };
}