# Chromy

Chromy tracks crypto prices in a clean dashboard.

Born in the noise of nonstop crypto markets, **Chromy** started as a simple idea: make real-time market intelligence feel clear, fast, and human. Built with SolidJS, Vite, and live Binance data, Chromy turns chaotic price movement into a clean command center for builders, traders, and curious newcomers chasing the next signal.

<p align="center">
  <img src="./assets/binance.svg" alt="Binance" width="420" />
</p>

## Tech Stack

<p align="center">
  <img src="https://cdn.simpleicons.org/solid/2C4F7C" alt="SolidJS" width="50" />
  <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" width="50" />
  <img src="https://cdn.simpleicons.org/vite/646CFF" alt="Vite" width="50" />
  <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="50" />
  <img src="https://cdn.simpleicons.org/binance/F0B90B" alt="Binance API" width="50" />
  <img src="https://cdn.simpleicons.org/websocket/FFFFFF" alt="WebSocket" width="50" />
</p>

| Icon | Stack |
|---|---|
| <img src="https://cdn.simpleicons.org/solid/2C4F7C" alt="SolidJS" width="24" /> | SolidJS |
| <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" width="24" /> | TypeScript |
| <img src="https://cdn.simpleicons.org/vite/646CFF" alt="Vite" width="24" /> | Vite |
| <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="Tailwind CSS" width="24" /> | Tailwind CSS |
| <img src="./assets/binance.svg" alt="Binance" width="68" /> | Binance REST + WebSocket |
| <img src="https://cdn.simpleicons.org/websocket/FFFFFF" alt="WebSocket" width="24" /> | WebSocket Streaming |

## Top 5 Coins

<p>
  <img src="https://cdn.simpleicons.org/bitcoin/F7931A" alt="Bitcoin (BTC)" width="34" />
  <img src="https://cdn.simpleicons.org/ethereum/627EEA" alt="Ethereum (ETH)" width="34" />
  <img src="https://cdn.simpleicons.org/binance/F0B90B" alt="BNB" width="34" />
  <img src="https://cdn.simpleicons.org/solana/14F195" alt="Solana (SOL)" width="34" />
  <img src="https://cdn.simpleicons.org/xrp/FFFFFF" alt="XRP" width="34" />
</p>

## Features

- Real-time updates using Binance WebSocket
- Dashboard + coin detail pages
- Search, sort, and watchlist mode
- Keyboard shortcuts (`/`, `W`, `R`, `Esc`)
- ZAR display formatting (`R`)

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
  pages/
public/
  favicon.svg
assets/
  binance.svg
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Data Source

- Binance public REST + WebSocket endpoints

## Contributors

https://github.com/MbuyeloMich/Chronos/graphs/contributors
