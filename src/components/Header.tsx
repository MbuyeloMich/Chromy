import { Component, Show, createSignal, onCleanup, onMount } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { useStore } from '../store';
import { Button, Input } from './ui';

const Header: Component = () => {
  const store = useStore();
  const location = useLocation();
  const isHome = () => location.pathname === '/';
  const [showSearch, setShowSearch] = createSignal(false);
  const [showCurrency, setShowCurrency] = createSignal(false);
  let currencyWrap: HTMLDivElement | undefined;

  const currencySymbol = () => ({ ZAR: 'R', USD: '$', GBP: '£', EUR: '€' }[store.state.currency]);

  onMount(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!currencyWrap) return;
      if (!currencyWrap.contains(e.target as Node)) setShowCurrency(false);
    };
    document.addEventListener('click', onDocClick);
    onCleanup(() => document.removeEventListener('click', onDocClick));
  });

  return (
    <header class="sticky top-0 z-20 app-header border-b border-white/5">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-14 flex items-center justify-between gap-2 sm:gap-4">
          <Show when={isHome()} fallback={
            <A href="/" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
              <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="text-sm">Back</span>
            </A>
          }>
            <A href="/" class="flex items-center gap-1.5 sm:gap-2 group min-w-0">
              <svg class="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <path d="M23.8 8.4A10.8 10.8 0 1 0 23.8 23.6" stroke="#ffffff" stroke-width="4.3" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M22.3 10.2A8.6 8.6 0 1 0 22.3 21.8" stroke="#38bdf8" stroke-opacity="0.38" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="hidden min-[380px]:inline font-semibold text-white/90 group-hover:text-white transition-colors truncate">Chromy</span>
            </A>
          </Show>

          <Show when={isHome()}>
            <div class="hidden sm:block flex-1 max-w-sm mx-4">
              <Input value={store.state.search} onInput={store.setSearch} onClear={store.clearSearch} placeholder="Search coins..." />
            </div>
          </Show>

          <div class="flex items-center gap-0.5 sm:gap-1">
            <div ref={currencyWrap} class="relative">
              <button
                onClick={() => setShowCurrency(!showCurrency())}
                class="w-7 h-7 rounded-md text-[10px] font-semibold transition-colors bg-white/10 text-white hover:bg-white/20"
                title="Currency"
              >
                {currencySymbol()}
              </button>
              <Show when={showCurrency()}>
                <div class="absolute right-0 mt-1 w-16 rounded-md border border-white/10 app-header shadow-xl z-40 overflow-hidden">
                  <button onClick={() => { store.setCurrency('ZAR'); setShowCurrency(false); }} class={`w-full h-7 text-[10px] transition-colors ${store.state.currency === 'ZAR' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>R</button>
                  <button onClick={() => { store.setCurrency('USD'); setShowCurrency(false); }} class={`w-full h-7 text-[10px] transition-colors ${store.state.currency === 'USD' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>$</button>
                  <button onClick={() => { store.setCurrency('GBP'); setShowCurrency(false); }} class={`w-full h-7 text-[10px] transition-colors ${store.state.currency === 'GBP' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>£</button>
                  <button onClick={() => { store.setCurrency('EUR'); setShowCurrency(false); }} class={`w-full h-7 text-[10px] transition-colors ${store.state.currency === 'EUR' ? 'text-white bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>€</button>
                </div>
              </Show>
            </div>

            <button
              onClick={store.toggleTheme}
              class="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              title={store.state.theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            >
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7" />
                <path d="M12 2.8V5.1M12 18.9V21.2M2.8 12H5.1M18.9 12H21.2M5.5 5.5L7.2 7.2M16.8 16.8L18.5 18.5M18.5 5.5L16.8 7.2M7.2 16.8L5.5 18.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
              </svg>
            </button>

            <Show when={isHome()}>
              <Button variant="ghost" size="sm" class="sm:hidden" onClick={() => setShowSearch(!showSearch())}>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
              <Button variant={store.state.watchlistOnly ? 'secondary' : 'ghost'} size="sm" class="hidden min-[430px]:inline-flex" onClick={store.toggleWatchlistOnly} title="Watchlist">
                <svg class={`w-4 h-4 ${store.state.watchlistOnly ? 'text-amber-400' : ''}`} fill={store.state.watchlistOnly ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span class="hidden sm:inline">Watchlist</span>
              </Button>
              <Button variant="ghost" size="sm" class="hidden min-[430px]:inline-flex" onClick={store.refetch} disabled={store.loading()} title="Refresh">
                <svg class={`w-4 h-4 ${store.loading() ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
            </Show>
          </div>
        </div>

        <Show when={isHome() && showSearch()}>
          <div class="pb-3 sm:hidden">
            <Input value={store.state.search} onInput={store.setSearch} onClear={() => { store.clearSearch(); setShowSearch(false); }} placeholder="Search..." autofocus />
          </div>
        </Show>
      </div>
    </header>
  );
};

export default Header;
