# HMM Market Regime Dashboard

本專案使用隱藏式馬可夫模型（HMM）概念，實作一個可互動的金融市場狀態判斷與資產配置系統。

## 功能介紹

- 使用者輸入：
  - 報酬率（Return）
  - 波動率（Volatility）
  - 回撤（Drawdown）
- 系統判斷市場狀態：
  - Bull Market（多頭）
  - Bear Market（空頭）
  - Sideways Market（盤整）
- 輸出：
  - 各市場狀態機率
  - 建議資產配置（股票 / 債券 / 現金）

---

## 模型邏輯

目前使用簡化版本的 HMM 規則進行推論：
- 根據輸入特徵判斷市場狀態
- 模擬狀態轉移機率
- 對應資產配置策略

---

## 前端（Next.js）

```bash
npm install
npm run dev
開啟：
http://localhost:3000

---

## 後端（FastAPI）
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

API：
http://127.0.0.1:8000/predict

---

## 前後端整合

前端透過 API 呼叫 /predict
將輸入資料傳送至後端並顯示分析結果

## 技術使用
Frontend：Next.js + Tailwind CSS
Backend：FastAPI
Model：HMM 概念（Rule-based Prototype）
## 專案目的

本專案為金融科技 UX/UI 原型設計
展示市場狀態判斷與資產配置流程