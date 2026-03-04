import { Component, Show, createSignal } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { useStore } from '../store';
import { Button, Input } from './ui';

const Header: Component = () => {
  const store = useStore();
  const location = useLocation();
  const isHome = () => location.pathname === '/';
  const [showSearch, setShowSearch] = createSignal(false);

  return (
    <header class="sticky top-0 z-20 app-header border-b border-white/5">
      <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div class="h-14 flex items-center justify-between gap-2 sm:gap-4">
          <Show when={isHome()} fallback={
            <A href="/" class="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors group">
              <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="text-sm">Back</span>
            </A>
          }>
            <A href="/" class="flex items-center gap-1.5 sm:gap-2 group min-w-0">
              <svg class="w-7 h-7" viewBox="0 0 512 509.64" fill="none" aria-label="Chromy logo">
                <defs>
                  <linearGradient id="chromy-clause-black-box" x1="32" y1="480" x2="480" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#050505" />
                    <stop offset="100%" stop-color="#141414" />
                  </linearGradient>
                  <linearGradient id="chromy-clause-green-mark" x1="96" y1="430" x2="430" y2="96" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#22c55e" />
                    <stop offset="100%" stop-color="#16a34a" />
                  </linearGradient>
                </defs>
                <path fill="url(#chromy-clause-black-box)" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.612-115.613 115.612H115.612C52.026 509.639 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/>
                                                <g fill="url(#chromy-clause-green-mark)">
                  <path d="M122 185c44-50 104-78 166-76 55 2 108 25 146 67l-49 43c-26-27-62-42-99-44-43-2-84 17-114 50l-50-40z"/>
                  <path d="M388 255c-22-22-53-35-86-35-61 0-111 45-121 104-6 36 4 73 29 101l-47 42c-37-41-53-99-43-155 16-87 91-153 182-153 51 0 99 20 133 56l-47 40z"/>
                  <path d="M103 333l57-25c20 45 62 74 111 77 48 4 93-18 122-58l47 34c-40 56-105 88-173 82-73-5-136-49-164-110z"/>
                  <circle cx="408" cy="122" r="18"/>
                  <circle cx="118" cy="408" r="12"/>
                </g>
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
            <Show when={isHome()}>
              <Button variant="ghost" size="sm" class="sm:hidden text-emerald-300 hover:text-emerald-200" onClick={() => setShowSearch(!showSearch())}>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
              <Button variant={store.state.watchlistOnly ? 'secondary' : 'ghost'} size="sm" class={`hidden min-[430px]:inline-flex ${store.state.watchlistOnly ? 'text-emerald-200' : 'text-emerald-300 hover:text-emerald-200'}`} onClick={store.toggleWatchlistOnly} title="Watchlist">
                <svg class={`w-4 h-4 ${store.state.watchlistOnly ? 'text-amber-400' : ''}`} fill={store.state.watchlistOnly ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span class="hidden sm:inline">Watchlist</span>
              </Button>
              <Button variant="ghost" size="sm" class="hidden min-[430px]:inline-flex text-emerald-300 hover:text-emerald-200" onClick={store.refetch} disabled={store.loading()} title="Refresh">
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













