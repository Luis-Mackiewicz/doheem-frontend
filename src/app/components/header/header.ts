import { Component, inject, signal, afterNextRender, HostListener } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  template: `
    <header role="banner"
      class="fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b transition-colors"
      [class.bg-neutral-950/90]="theme.theme() === 'dark'"
      [class.bg-white/80]="theme.theme() === 'light'"
      [class.border-white/10]="theme.theme() === 'dark'"
      [class.border-violet-200]="theme.theme() === 'light'">

      <div class="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-2">

        <a routerLink="/" class="flex items-center gap-3">
          <img src="doheem_logo.png" alt="Doheem" loading="lazy" width="120" height="32" class="h-8 w-auto rounded-lg" />
          <span class="font-bold text-xl tracking-tight"
            [class.text-white]="theme.theme() === 'dark'"
            [class.text-violet-900]="theme.theme() === 'light'">
            Doheem
          </span>
        </a>

        <nav aria-label="Navegação principal" class="hidden md:flex items-center gap-1">
          @for (link of navLinks; track link.id) {
            <button (click)="scrollTo(link.id)"
              class="relative px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
              [class.text-white/60]="theme.theme() === 'dark' && activeSection() !== link.id"
              [class.text-white]="theme.theme() === 'dark' && activeSection() === link.id"
              [class.text-violet-700/60]="theme.theme() === 'light' && activeSection() !== link.id"
              [class.text-violet-900]="theme.theme() === 'light' && activeSection() === link.id"
              [class.hover:text-white]="theme.theme() === 'dark'"
              [class.hover:text-violet-900]="theme.theme() === 'light'"
              [class.hover:bg-white/5]="theme.theme() === 'dark'"
              [class.hover:bg-violet-100]="theme.theme() === 'light'"
              [attr.aria-current]="activeSection() === link.id ? 'section' : undefined">
              {{ link.label }}
            </button>
          }
        </nav>

        <div class="flex items-center gap-2">
          <a routerLink="/perfil" aria-label="Perfil"
            class="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition"
            [class.bg-white/10]="theme.theme() === 'dark'"
            [class.bg-violet-100]="theme.theme() === 'light'"
            [class.border]="true"
            [class.border-white/20]="theme.theme() === 'dark'"
            [class.border-violet-200]="theme.theme() === 'light'"
            [class.hover:bg-white/20]="theme.theme() === 'dark'"
            [class.hover:bg-violet-200]="theme.theme() === 'light'">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              [class.text-white/70]="theme.theme() === 'dark'"
              [class.text-violet-700]="theme.theme() === 'light'">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </a>

          <button (click)="toggleMobile()"
            [attr.aria-label]="mobileOpen() ? 'Fechar menu de navegação' : 'Abrir menu de navegação'"
            [attr.aria-expanded]="mobileOpen()"
            aria-controls="mobile-menu"
            class="md:hidden w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition"
            [class.bg-white/10]="theme.theme() === 'dark'"
            [class.bg-violet-100]="theme.theme() === 'light'"
            [class.hover:bg-white/20]="theme.theme() === 'dark'"
            [class.hover:bg-violet-200]="theme.theme() === 'light'">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
              [class.text-white/70]="theme.theme() === 'dark'"
              [class.text-violet-700]="theme.theme() === 'light'">
              @if (mobileOpen()) {
                <path d="M18 6L6 18M6 6l12 12"/>
              } @else {
                <path d="M3 12h18M3 6h18M3 18h18"/>
              }
            </svg>
          </button>
        </div>
      </div>

      @if (mobileOpen()) {
        <div id="mobile-menu" role="navigation" aria-label="Navegação mobile"
          class="md:hidden border-t backdrop-blur-xl animate-slide-down"
          [class.border-white/10]="theme.theme() === 'dark'"
          [class.border-violet-200]="theme.theme() === 'light'"
          [class.bg-neutral-950]="theme.theme() === 'dark'"
          [class.bg-white]="theme.theme() === 'light'">
          <div class="flex flex-col px-4 py-2">
            @for (link of navLinks; track link.id) {
              <button (click)="scrollTo(link.id); mobileOpen.set(false)"
                class="px-3 py-2.5 rounded-lg text-sm font-medium text-left transition"
                [class.text-white/60]="theme.theme() === 'dark' && activeSection() !== link.id"
                [class.text-white]="theme.theme() === 'dark' && activeSection() === link.id"
                [class.text-violet-700/60]="theme.theme() === 'light' && activeSection() !== link.id"
                [class.text-violet-900]="theme.theme() === 'light' && activeSection() === link.id"
                [class.hover:bg-white/5]="theme.theme() === 'dark'"
                [class.hover:bg-violet-100]="theme.theme() === 'light'"
                [attr.aria-current]="activeSection() === link.id ? 'section' : undefined">
                {{ link.label }}
              </button>
            }
          </div>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  protected theme = inject(ThemeService);
  protected activeSection = signal('');
  protected mobileOpen = signal(false);

  protected navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'app', label: 'App' },
  ];

  constructor(private router: Router) {
    if (router.url === '/') {
      this.activeSection.set('home');
    }

    router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (e.url === '/') {
          this.activeSection.set('home');
        } else {
          this.activeSection.set('');
        }
      });

    afterNextRender(() => {
      this.initActiveSectionObserver();
    });
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.mobileOpen.set(false);
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  private initActiveSectionObserver(): void {
    const sections = this.navLinks
      .map((l) => document.getElementById(l.id))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        }
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' },
    );

    for (const section of sections) {
      observer.observe(section);
    }
  }

  scrollTo(section: string): void {
    if (this.router.url === '/') {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        requestAnimationFrame(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        });
      });
    }
  }
}
