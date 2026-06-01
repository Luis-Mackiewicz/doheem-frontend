import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header class="fixed top-0 left-0 w-full z-50 bg-purple-dark/60 backdrop-blur-xl border-b border-white/10">
      <div class="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-16 lg:px-24 py-4">
        <a routerLink="/" class="flex items-center gap-3">
          <img src="doheem_loogo.png" alt="Doheem" class="h-8 w-auto rounded-full" />
          <span class="text-white font-bold text-xl tracking-tight">Doheem</span>
        </a>

        <nav class="hidden md:flex items-center gap-1">
          @for (link of navLinks; track link.id) {
            <button (click)="scrollTo(link.id)"
              class="px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer">
              {{ link.label }}
            </button>
          }
        </nav>

        <a routerLink="/perfil" class="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition">
          <svg class="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </a>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected navLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'app', label: 'App' },
  ];

  constructor(private router: Router) {}

  scrollTo(section: string): void {
    if (this.router.url === '/') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    }
  }
}
