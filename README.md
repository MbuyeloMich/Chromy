# Chromy

Chromy is a real-time cryptocurrency dashboard built with SolidJS, Vite, and Binance public market data.

## Overview

- App title and branding: `Chromy`
- Live market updates via Binance WebSocket
- Dashboard + coin detail pages
- ZAR display formatting for prices and market values (`R`)
- Watchlist support with local persistence

## Features

### Real-Time Data

- Live ticker updates for top symbols
- Connection state indicator (`connected`, `connecting`, `disconnected`)
- Automatic reconnect handling
- Buffered UI updates for smoother rendering

### Dashboard

- Top coins from `USDT` pairs (filtered/excluded set applied)
- Market cards:
  - Market Cap
  - 24h Volume
  - Gainers
  - Losers
- Top gainers/top losers side panels
- Search and sort by:
  - Market cap
  - Price
  - 24h change
  - Volume
- Watchlist mode and quick toggles

### Coin Detail

- Interactive chart ranges: `24H`, `7D`, `30D`, `90D`, `1Y`
- Live order book
- Recent trades feed
- Market stats panel
- 24h range indicator

### Keyboard Shortcuts

- `/` focus search
- `W` toggle watchlist
- `R` refresh data
- `Esc` clear search

## Currency Formatting (ZAR)

Implemented in `src/utils.ts`.

- Fixed conversion constant: `USD_TO_ZAR = 18.5`
- `fmt(...)` returns ZAR values for live price displays
- `compactCurrency(...)` returns compact values for large stats (for example `R1.25T`)
- `compactNum(...)` is used for non-currency compact quantities

Note: conversion is currently fixed (not live FX).

## Tech Stack

- SolidJS
- TypeScript
- Vite
- Tailwind CSS v4
- Binance REST + WebSocket endpoints

## Project Structure

```text
src/
  api.ts
  store.tsx
  types.ts
  utils.ts
  index.tsx
  index.css
  components/
    Header.tsx
    CoinList.tsx
    PriceChart.tsx
    OrderBook.tsx
    RecentTrades.tsx
    Sparkline.tsx
    ui.tsx
    ErrorBoundary.tsx
  pages/
    Dashboard.tsx
    CoinDetail.tsx
    NotFound.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Default local URL:

`http://127.0.0.1:5173`

### Build and Preview

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run preview` - preview build

## Data Sources

Public Binance endpoints:

- `GET /api/v3/ticker/24hr`
- `GET /api/v3/klines`
- `GET /api/v3/depth`
- `GET /api/v3/trades`
- `wss://stream.binance.com:9443/ws`

No API key required for these endpoints.

## Contributors

https://github.com/MbuyeloMich/Chronos/graphs/contributors
