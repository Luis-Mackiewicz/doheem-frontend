import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="fixed top-0 left-0 w-full z-50 bg-purple-dark/60 backdrop-blur-xl border-b border-white/10">
      <div class="max-w-7xl mx-auto flex items-center gap-3 px-6 md:px-16 lg:px-24 py-4">
        <img src="doheem_loogo.png" alt="Doheem" class="h-8 w-auto" />
        <span class="text-white font-bold text-xl tracking-tight">Doheem</span>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
