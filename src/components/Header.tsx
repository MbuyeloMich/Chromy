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
                <path fill="url(#chromy-clause-green-mark)" fill-rule="nonzero" transform="translate(-7 5) scale(0.975 1.015)" d="M142.27 316.619l73.655-41.326 1.238-3.589-1.238-1.996-3.589-.001-12.31-.759-42.084-1.138-36.498-1.516-35.361-1.896-8.897-1.895-8.34-10.995.859-5.484 7.482-5.03 10.717.935 23.683 1.617 35.537 2.452 25.782 1.517 38.193 3.968h6.064l.86-2.451-2.073-1.517-1.618-1.517-36.776-24.922-39.81-26.338-20.852-15.166-11.273-7.683-5.687-7.204-2.451-15.721 10.237-11.273 13.75.935 3.513.936 13.928 10.716 29.749 23.027 38.848 28.612 5.687 4.727 2.275-1.617.278-1.138-2.553-4.271-21.13-38.193-22.546-38.848-10.035-16.101-2.654-9.655c-.935-3.968-1.617-7.304-1.617-11.374l11.652-15.823 6.445-2.073 15.545 2.073 6.547 5.687 9.655 22.092 15.646 34.78 24.265 47.291 7.103 14.028 3.791 12.992 1.416 3.968 2.449-.001v-2.275l1.997-26.641 3.69-32.707 3.589-42.084 1.239-11.854 5.863-14.206 11.652-7.683 9.099 4.348 7.482 10.716-1.036 6.926-4.449 28.915-8.72 45.294-5.687 30.331h3.313l3.792-3.791 15.342-20.372 25.782-32.227 11.374-12.789 13.27-14.129 8.517-6.724 16.1-.001 11.854 17.617-5.307 18.199-16.581 21.029-13.75 17.819-19.716 26.54-12.309 21.231 1.138 1.694 2.932-.278 44.536-9.479 24.062-4.347 28.714-4.928 12.992 6.066 1.416 6.167-5.106 12.613-30.71 7.583-36.018 7.204-53.636 12.689-.657.48.758.935 24.164 2.275 10.337.556h25.301l47.114 3.514 12.309 8.139 7.381 9.959-1.238 7.583-18.957 9.655-25.579-6.066-59.702-14.205-20.474-5.106-2.83-.001v1.694l17.061 16.682 31.266 28.233 39.152 36.397 1.997 8.999-5.03 7.102-5.307-.758-34.401-25.883-13.27-11.651-30.053-25.302-1.996-.001v2.654l6.926 10.136 36.574 54.975 1.895 16.859-2.653 5.485-9.479 3.311-10.414-1.895-21.408-30.054-22.092-33.844-17.819-30.331-2.173 1.238-10.515 113.261-4.929 5.788-11.374 4.348-9.478-7.204-5.03-11.652 5.03-23.027 6.066-30.052 4.928-23.886 4.449-29.674 2.654-9.858-.177-.657-2.173.278-22.37 30.71-34.021 45.977-26.919 28.815-6.445 2.553-11.173-5.789 1.037-10.337 6.243-9.2 37.257-47.392 22.47-29.371 14.508-16.961-.101-2.451h-.859l-98.954 64.251-17.618 2.275-7.583-7.103.936-11.652 3.589-3.791 29.749-20.474-.101.102.024.101z"/>
              </svg>
              <span class="hidden min-[380px]:inline font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors truncate">Chromy</span>
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















