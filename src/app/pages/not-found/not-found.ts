import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="min-h-dvh flex flex-col items-center justify-center bg-linear-to-br from-purple-dark to-purple-medium text-white px-6">
      <h1 class="text-7xl md:text-8xl font-extrabold tracking-tight">404</h1>
      <p class="text-white/50 text-lg mt-2">Página não encontrada</p>
      <a routerLink="/" class="mt-8 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
        ← Voltar ao início
      </a>
    </section>
  `,
})
export class NotFoundPage {}
