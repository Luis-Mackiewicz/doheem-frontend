import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="fixed top-0 left-0 w-full z-50 bg-purple-dark/60 backdrop-blur-xl border-b border-white/10">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 lg:px-24 py-4">
        <div class="flex items-center gap-3">
          <img src="doheem_loogo.png" alt="Doheem" class="h-8 w-auto" />
          <span class="text-white font-bold text-xl tracking-tight">Doheem</span>
        </div>
        <a routerLink="/" class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
          <svg class="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </a>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
