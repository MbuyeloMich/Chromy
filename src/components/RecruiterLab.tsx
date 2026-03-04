import { Component, For, Show, createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import type { Coin } from '../types';
import { Card, Button } from './ui';
import { fmt, pct, fullCurrency } from '../utils';

interface Sample {
  ts: number;
  price: number;
  volume: number;
}

interface SignalInsight {
  id: string;
  symbol: string;
  score: number;
  momentum5: number;
  momentum15: number;
  breakout: boolean;
  volumePulse: number;
  reasons: string[];
}

interface Props {
  coins: Coin[];
}

const SAMPLE_INTERVAL_MS = 2000;
const MAX_SAMPLES = 600; // ~20 minutes at 2s/sample

function stdDev(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, v) => a + (v - mean) ** 2, 0) / (nums.length - 1);
  return Math.sqrt(variance);
}

const RecruiterLab: Component<Props> = (props) => {
  const [histories, setHistories] = createSignal<Record<string, Sample[]>>({});
  const [lastSampleAt, setLastSampleAt] = createSignal(0);
  const [selectedCoinId, setSelectedCoinId] = createSignal<string>('');
  const [replayIndex, setReplayIndex] = createSignal<number>(0);
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [speed, setSpeed] = createSignal(1);
  const [holdings, setHoldings] = createSignal<Record<string, number>>({});

  const tracked = createMemo(() => [...props.coins].sort((a, b) => b.market_cap - a.market_cap).slice(0, 12));

  createEffect(() => {
    const now = Date.now();
    if (now - lastSampleAt() < SAMPLE_INTERVAL_MS) return;
    const top = tracked();
    if (!top.length) return;

    setHistories((prev) => {
      const next = { ...prev };
      for (const c of top) {
        const row = next[c.id] ? [...next[c.id]] : [];
        row.push({ ts: now, price: c.current_price, volume: c.total_volume });
        if (row.length > MAX_SAMPLES) row.splice(0, row.length - MAX_SAMPLES);
        next[c.id] = row;
      }
      return next;
    });

    setLastSampleAt(now);
  });

  createEffect(() => {
    const currentIds = new Set(tracked().map((c) => c.id));
    setHoldings((prev) => {
      const next = { ...prev };
      for (const id of currentIds) if (next[id] === undefined) next[id] = 0;
      return next;
    });

    if (!selectedCoinId() && tracked().length) setSelectedCoinId(tracked()[0].id);
  });

  const selectedHistory = createMemo(() => histories()[selectedCoinId()] ?? []);
  const selectedCoin = createMemo(() => tracked().find((c) => c.id === selectedCoinId()));

  createEffect(() => {
    const h = selectedHistory();
    if (!h.length) {
      setReplayIndex(0);
      return;
    }
    if (replayIndex() >= h.length) setReplayIndex(h.length - 1);
  });

  createEffect(() => {
    if (!isPlaying()) return;
    const timer = setInterval(() => {
      const h = selectedHistory();
      if (h.length <= 1) return;
      setReplayIndex((i) => {
        if (i >= h.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return Math.min(i + 1, h.length - 1);
      });
    }, Math.max(60, Math.floor(700 / speed())));
    onCleanup(() => clearInterval(timer));
  });

  const replaySample = createMemo(() => {
    const h = selectedHistory();
    if (!h.length) return null;
    const idx = Math.max(0, Math.min(h.length - 1, replayIndex()));
    return h[idx];
  });

  const replayChange = createMemo(() => {
    const h = selectedHistory();
    const s = replaySample();
    if (!h.length || !s) return 0;
    return ((s.price - h[0].price) / h[0].price) * 100;
  });

  const insights = createMemo<SignalInsight[]>(() => {
    const out: SignalInsight[] = [];
    for (const c of tracked()) {
      const h = histories()[c.id] ?? [];
      if (h.length < 20) continue;

      const last = h[h.length - 1];
      const p5 = h[Math.max(0, h.length - 6)]?.price ?? last.price;
      const p15 = h[Math.max(0, h.length - 16)]?.price ?? last.price;
      const momentum5 = ((last.price - p5) / p5) * 100;
      const momentum15 = ((last.price - p15) / p15) * 100;

      const prevPrices = h.slice(Math.max(0, h.length - 21), h.length - 1).map((x) => x.price);
      const breakout = prevPrices.length > 0 ? last.price >= Math.max(...prevPrices) : false;

      const deltas: number[] = [];
      for (let i = Math.max(1, h.length - 20); i < h.length; i++) {
        deltas.push(Math.max(0, h[i].volume - h[i - 1].volume));
      }
      const recentDelta = deltas[deltas.length - 1] ?? 0;
      const avgDelta = deltas.length > 1 ? deltas.slice(0, -1).reduce((a, b) => a + b, 0) / (deltas.length - 1) : recentDelta;
      const volumePulse = avgDelta > 0 ? recentDelta / avgDelta : 1;

      const score = momentum5 * 1.8 + momentum15 * 0.7 + (breakout ? 3 : 0) + (volumePulse - 1) * 4;
      const reasons: string[] = [];
      reasons.push(`5-sample momentum ${pct(momentum5)}`);
      reasons.push(`15-sample momentum ${pct(momentum15)}`);
      if (breakout) reasons.push('Local breakout above recent range');
      if (volumePulse >= 1.8) reasons.push(`Volume pulse ${volumePulse.toFixed(2)}x`);

      out.push({
        id: c.id,
        symbol: c.symbol.toUpperCase(),
        score,
        momentum5,
        momentum15,
        breakout,
        volumePulse,
        reasons,
      });
    }
    return out.sort((a, b) => Math.abs(b.score) - Math.abs(a.score)).slice(0, 6);
  });

  const portfolio = createMemo(() => {
    const positions = tracked()
      .map((c) => {
        const units = holdings()[c.id] ?? 0;
        const value = units * c.current_price;
        return { coin: c, units, value };
      })
      .filter((p) => p.units > 0);

    const total = positions.reduce((s, p) => s + p.value, 0);
    if (total <= 0) return { positions: [], total: 0, concentration: 0, hhi: 0, var95: 0, top: null as null | string };

    const weights = positions.map((p) => p.value / total);
    const hhi = weights.reduce((s, w) => s + w * w, 0);
    const concentration = Math.max(...weights);

    const vols = positions.map((p) => {
      const h = histories()[p.coin.id] ?? [];
      if (h.length < 12) return 0;
      const returns: number[] = [];
      for (let i = 1; i < h.length; i++) returns.push((h[i].price - h[i - 1].price) / h[i - 1].price);
      return stdDev(returns.slice(-60));
    });

    const portVol = Math.sqrt(weights.reduce((s, w, i) => s + (w * vols[i]) ** 2, 0));
    const var95 = total * 1.65 * portVol;
    const top = positions.sort((a, b) => b.value - a.value)[0]?.coin.symbol.toUpperCase() ?? null;

    return { positions, total, concentration, hhi, var95, top };
  });

  return (
    <div class="space-y-4 mb-6">
      <div class="grid xl:grid-cols-3 gap-4">
        <Card class="xl:col-span-1">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-zinc-300">1) Market Replay</h3>
            <span class="text-[10px] text-zinc-500">Time travel</span>
          </div>

          <div class="flex flex-wrap gap-2 mb-3">
            <For each={tracked().slice(0, 8)}>
              {(c) => (
                <button onClick={() => { setSelectedCoinId(c.id); setReplayIndex(Math.max(0, (histories()[c.id]?.length ?? 1) - 1)); setIsPlaying(false); }} class={`px-2 py-1 rounded-md text-xs transition-colors ${selectedCoinId() === c.id ? 'bg-cyan-400/15 text-cyan-300' : 'bg-white/5 text-zinc-400 hover:text-zinc-200'}`}>
                  {c.symbol.toUpperCase()}
                </button>
              )}
            </For>
          </div>

          <Show when={replaySample() && selectedCoin()}>
            {(s) => (
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-xl font-mono">{fmt(s().price)}</div>
                    <div class={`text-xs font-mono ${replayChange() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{pct(replayChange())}</div>
                  </div>
                  <div class="text-right text-[10px] text-zinc-500">
                    <div>{selectedCoin()!.symbol.toUpperCase()}</div>
                    <div>{new Date(s().ts).toLocaleTimeString()}</div>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max={Math.max(0, selectedHistory().length - 1)}
                  value={replayIndex()}
                  onInput={(e) => setReplayIndex(parseInt(e.currentTarget.value, 10))}
                  class="w-full accent-cyan-400"
                />

                <div class="flex items-center gap-2">
                  <Button size="sm" variant={isPlaying() ? 'secondary' : 'ghost'} onClick={() => setIsPlaying(!isPlaying())}>{isPlaying() ? 'Pause' : 'Play'}</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setIsPlaying(false); setReplayIndex(Math.max(0, selectedHistory().length - 1)); }}>Live</Button>
                  <div class="ml-auto flex items-center gap-1">
                    <For each={[1, 5, 20]}>
                      {(v) => (
                        <button onClick={() => setSpeed(v)} class={`px-2 py-1 text-[10px] rounded ${speed() === v ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-zinc-500'}`}>{v}x</button>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            )}
          </Show>
          <Show when={!replaySample()}>
            <div class="text-xs text-zinc-500">Collecting replay samples...</div>
          </Show>
        </Card>

        <Card class="xl:col-span-1">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-zinc-300">2) Signal Engine</h3>
            <span class="text-[10px] text-zinc-500">Explainability</span>
          </div>
          <div class="space-y-2">
            <For each={insights()}>
              {(s) => (
                <div class="p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/40">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs font-medium">{s.symbol}</span>
                    <span class={`text-[10px] font-mono ${s.score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.score >= 0 ? '+' : ''}{s.score.toFixed(2)}</span>
                  </div>
                  <div class="text-[10px] text-zinc-400">{s.reasons.slice(0, 2).join(' | ')}</div>
                </div>
              )}
            </For>
            <Show when={!insights().length}>
              <div class="text-xs text-zinc-500">Waiting for enough samples to generate signals...</div>
            </Show>
          </div>
        </Card>

        <Card class="xl:col-span-1">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-zinc-300">3) Portfolio Risk Lab</h3>
            <span class="text-[10px] text-zinc-500">Sandbox</span>
          </div>
          <div class="space-y-2 mb-3">
            <For each={tracked().slice(0, 6)}>
              {(c) => (
                <div class="grid grid-cols-[1fr_90px] gap-2 items-center">
                  <span class="text-xs text-zinc-400">{c.symbol.toUpperCase()}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={holdings()[c.id] ?? 0}
                    onInput={(e) => setHoldings((p) => ({ ...p, [c.id]: Math.max(0, parseFloat(e.currentTarget.value) || 0) }))}
                    class="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs font-mono text-right"
                  />
                </div>
              )}
            </For>
          </div>
          <div class="grid grid-cols-2 gap-2 text-[10px]">
            <div class="bg-zinc-800/30 rounded p-2">
              <div class="text-zinc-500 mb-1">Total</div>
              <div class="font-mono text-zinc-200">{fullCurrency(portfolio().total)}</div>
            </div>
            <div class="bg-zinc-800/30 rounded p-2">
              <div class="text-zinc-500 mb-1">Concentration</div>
              <div class="font-mono text-zinc-200">{(portfolio().concentration * 100).toFixed(1)}%</div>
            </div>
            <div class="bg-zinc-800/30 rounded p-2">
              <div class="text-zinc-500 mb-1">HHI</div>
              <div class="font-mono text-zinc-200">{portfolio().hhi.toFixed(3)}</div>
            </div>
            <div class="bg-zinc-800/30 rounded p-2">
              <div class="text-zinc-500 mb-1">VaR 95%</div>
              <div class="font-mono text-zinc-200">{fullCurrency(portfolio().var95)}</div>
            </div>
          </div>
          <Show when={portfolio().top}>
            <div class="mt-2 text-[10px] text-zinc-500">Largest exposure: <span class="text-zinc-300">{portfolio().top}</span></div>
          </Show>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterLab;
