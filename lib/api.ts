import {
  AnalysisInput,
  AnalysisResult,
  normalizePredictResponse,
} from "@/lib/hmm";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function predictMarketState(
  input: AnalysisInput
): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      returns: input.returns,
      volatility: input.volatility,
      drawdown: input.drawdown,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const payload = await response.json();
  return normalizePredictResponse(payload);
}
