import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="min-h-dvh flex flex-col items-center justify-center bg-page text-primary px-6">
      <h1 class="text-7xl md:text-8xl font-extrabold tracking-tight">404</h1>
      <p class="text-muted text-lg mt-2">Página não encontrada</p>
      <a routerLink="/" class="mt-8 inline-flex items-center gap-2 bg-card border-theme text-primary font-semibold px-6 py-3 rounded-xl hover-bg transition">
        ← Voltar ao início
      </a>
    </section>
  `,
})
export class NotFoundPage {}
