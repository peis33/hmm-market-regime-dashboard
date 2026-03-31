from typing import Dict, List, Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


BULL = "\u591a\u982d\u64f4\u5f35"
SIDEWAY = "\u76e4\u6574\u89c0\u671b"
BEAR = "\u7a7a\u982d\u9632\u79a6"


class PredictRequest(BaseModel):
    returns: float = Field(..., description="Expected return in percent")
    volatility: float = Field(..., description="Annualized volatility in percent")
    drawdown: float = Field(..., description="Maximum drawdown in percent")


class AllocationItem(BaseModel):
    name: str
    value: int


class PredictResponse(BaseModel):
    market_regime: Literal[BULL, SIDEWAY, BEAR]
    regime_probabilities: Dict[str, float]
    allocation: List[AllocationItem]
    market_state: str
    regime: str
    probability: float
    summary: str
    signal: str


app = FastAPI(title="HMM Dashboard Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def clamp(value: float, minimum: float, maximum: float) -> float:
    return max(minimum, min(value, maximum))


def infer_market_regime(
    returns: float, volatility: float, drawdown: float
) -> PredictResponse:
    normalized_return = clamp((returns + 15) / 30, 0, 1)
    normalized_volatility = clamp(volatility / 40, 0, 1)
    normalized_drawdown = clamp(abs(drawdown) / 35, 0, 1)

    bull_score = (
        normalized_return * 0.62
        + (1 - normalized_volatility) * 0.23
        + (1 - normalized_drawdown) * 0.15
    )
    sideway_score = (
        (1 - abs(normalized_return - 0.5) * 2) * 0.45
        + (1 - abs(normalized_volatility - 0.45) * 1.6) * 0.30
        + (1 - abs(normalized_drawdown - 0.30) * 1.4) * 0.25
    )
    bear_score = (
        (1 - normalized_return) * 0.28
        + normalized_volatility * 0.34
        + normalized_drawdown * 0.38
    )

    raw_scores = {
        BULL: max(bull_score, 0.001),
        SIDEWAY: max(sideway_score, 0.001),
        BEAR: max(bear_score, 0.001),
    }

    total_score = sum(raw_scores.values())
    regime_probabilities = {
        regime: round(score / total_score * 100, 1)
        for regime, score in raw_scores.items()
    }

    market_regime = max(regime_probabilities, key=regime_probabilities.get)
    probability = regime_probabilities[market_regime]

    allocation_map = {
        BULL: [
            AllocationItem(name="\u80a1\u7968\u578b\u8cc7\u7522", value=70),
            AllocationItem(name="\u50b5\u5238\u578b\u8cc7\u7522", value=15),
            AllocationItem(name="\u73fe\u91d1", value=15),
        ],
        SIDEWAY: [
            AllocationItem(name="\u80a1\u7968\u578b\u8cc7\u7522", value=45),
            AllocationItem(name="\u50b5\u5238\u578b\u8cc7\u7522", value=30),
            AllocationItem(name="\u73fe\u91d1", value=25),
        ],
        BEAR: [
            AllocationItem(name="\u80a1\u7968\u578b\u8cc7\u7522", value=20),
            AllocationItem(name="\u50b5\u5238\u578b\u8cc7\u7522", value=40),
            AllocationItem(name="\u73fe\u91d1", value=40),
        ],
    }

    summary_map = {
        BULL: "\u5831\u916c\u52d5\u80fd\u8f03\u5f37\uff0c\u6ce2\u52d5\u8207\u56de\u64a4\u76f8\u5c0d\u53ef\u63a7\uff0c\u5e02\u5834\u504f\u5411\u98a8\u96aa\u8cc7\u7522\u64f4\u5f35\u3002",
        SIDEWAY: "\u5831\u916c\u8207\u98a8\u96aa\u8a0a\u865f\u8f03\u70ba\u5747\u8861\uff0c\u5e02\u5834\u53ef\u80fd\u7dad\u6301\u5340\u9593\u9707\u76ea\u3002",
        BEAR: "\u6ce2\u52d5\u8207\u56de\u64a4\u58d3\u529b\u5347\u9ad8\uff0c\u5efa\u8b70\u512a\u5148\u63d0\u9ad8\u9632\u79a6\u8207\u6d41\u52d5\u6027\u3002",
    }

    signal_map = {
        BULL: "\u53ef\u504f\u591a\u914d\u7f6e\uff0c\u9010\u6b65\u63d0\u9ad8\u6210\u9577\u578b\u8207\u98a8\u96aa\u6027\u8cc7\u7522\u6bd4\u91cd\u3002",
        SIDEWAY: "\u5efa\u8b70\u4e2d\u6027\u914d\u7f6e\uff0c\u4fdd\u7559\u73fe\u91d1\u8207\u50b5\u5238\u90e8\u4f4d\u7b49\u5f85\u65b9\u5411\u78ba\u8a8d\u3002",
        BEAR: "\u5efa\u8b70\u964d\u4f4e\u80a1\u7968\u66dd\u96aa\uff0c\u5f37\u5316\u73fe\u91d1\u8207\u9632\u79a6\u578b\u8cc7\u7522\u914d\u7f6e\u3002",
    }

    return PredictResponse(
        market_regime=market_regime,
        regime_probabilities=regime_probabilities,
        allocation=allocation_map[market_regime],
        market_state=market_regime,
        regime=market_regime,
        probability=probability,
        summary=summary_map[market_regime],
        signal=signal_map[market_regime],
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    return infer_market_regime(
        returns=payload.returns,
        volatility=payload.volatility,
        drawdown=payload.drawdown,
    )