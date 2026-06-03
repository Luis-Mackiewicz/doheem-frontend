import { Component, ElementRef, viewChildren, afterNextRender, inject } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';
import { PwaInstallService } from '../../services/pwa-install-service';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent],
  template: `
    <div id="main-content" class="bg-page text-white overflow-x-hidden">

      <section #animateSection id="inicio"
        class="relative min-h-dvh flex flex-col justify-center opacity-0"
        aria-label="Seção inicial">

        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 px-6 md:px-16 lg:px-24 py-16">

          <div class="flex flex-col gap-6 order-2 md:order-1">

            <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-accent">
              Gerencie finanças e tarefas
            </h1>

            <p class="text-lg md:text-xl text-secondary max-w-lg leading-relaxed">
              Organize despesas, divida contas e coordene tarefas com seus amigos e familiares.
              Tudo em um só lugar, simples e organizado.
            </p>

            <div class="flex flex-wrap gap-4 mt-2">
              <app-button variant="solid" href="/register" label="Criar conta grátis"></app-button>
              <app-button variant="outline" href="/login" label="Entrar"></app-button>
            </div>

            <p class="text-xs text-muted mt-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Gratuito. Sem compromisso. Comece em segundos.
            </p>
          </div>

          <div class="flex justify-center items-center order-1 md:order-2">
            <div class="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src="friends.jpg"
                   alt="Grupo de amigos sentados em um sofá utilizando um tablet para organizar finanças e tarefas domésticas"
                   loading="lazy"
                   class="w-full h-full object-cover" />
            </div>
          </div>

        </div>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted" aria-hidden="true">
          <span class="text-sm">Role para conhecer</span>
          <svg class="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </section>

      <section #animateSection id="sobre"
        class="min-h-dvh flex flex-col justify-center opacity-0"
        aria-label="Sobre o Doheem">

        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16 px-6 md:px-16 lg:px-24 py-24">

          <div class="flex justify-center items-center">
            <div class="w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <img src="doheem_logo.png"
                   alt="Logotipo do Doheem: ilustração estilizada representando uma casa moderna"
                   loading="lazy"
                   class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <h2 class="text-3xl md:text-4xl font-bold text-accent">O que é o Doheem?</h2>
            <p class="text-lg text-secondary leading-relaxed">
              Doheem é uma plataforma completa de gestão da casa voltado para repúblicas estudantis.
              Com ela, você organiza despesas, divide contas, coordena tarefas domésticas
              e mantém tudo transparente entre os moradores.
            </p>
            <p class="text-lg text-secondary leading-relaxed">
              Chega de planilhas perdidas e conversas no WhatsApp. Tudo centralizado,
              simples e pensado para facilitar o dia a dia da sua república.
            </p>

            <div class="flex flex-wrap gap-6 mt-4">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span class="text-sm text-secondary">Despesas compartilhadas</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span class="text-sm text-secondary">Tarefas organizadas</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span class="text-sm text-secondary">Transparência total</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section #animateSection id="depoimentos"
        class="min-h-dvh flex flex-col justify-center opacity-0"
        aria-label="Depoimentos de usuários">

        <div class="max-w-7xl mx-auto w-full px-6 md:px-16 lg:px-24 py-24">

          <div class="text-center mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-accent mb-4">
              Quem usa recomenda
            </h2>
            <p class="text-lg text-secondary max-w-xl mx-auto">
              Veja o que os moradores de repúblicas estão dizendo sobre o Doheem.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (depoimento of depoimentos; track depoimento.nome) {
              <div class="bg-card rounded-2xl p-6 border border-theme flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0"
                       [class]="depoimento.cor"
                       aria-hidden="true">
                    {{ depoimento.iniciais }}
                  </div>
                  <div>
                    <p class="text-primary font-semibold text-sm">{{ depoimento.nome }}</p>
                    <p class="text-muted text-xs">{{ depoimento.cidade }}</p>
                  </div>
                </div>
                <p class="text-secondary text-sm leading-relaxed">
                  "{{ depoimento.texto }}"
                </p>
              </div>
            }
          </div>

        </div>
      </section>

      <section #animateSection id="app"
        class="min-h-dvh flex flex-col justify-center opacity-0"
        aria-label="Baixe o aplicativo">

        <div class="max-w-7xl mx-auto w-full flex flex-col items-center text-center px-6 md:px-16 lg:px-24 py-24">

          <h2 class="text-3xl md:text-4xl font-bold mb-4 text-accent">Baixe o Doheem</h2>
          <p class="text-lg text-secondary max-w-xl leading-relaxed mb-8">
            Instale o Doheem no seu celular ou computador e tenha acesso rápido
            a todas as funcionalidades, tudo na palma da sua mão.
          </p>

          @if (pwaService.canInstall()) {
            <button (click)="pwaService.install()"
              class="inline-flex items-center gap-3 bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-violet-600 hover:text-white transition-all shadow-lg cursor-pointer text-lg"
              [attr.aria-label]="'Instalar Doheem no ' + (pwaService.platform() === 'desktop' ? 'computador' : 'celular')">
              <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {{ pwaService.installLabel() }}
            </button>
          } @else {
            <div class="flex flex-col items-center gap-4">
              <button disabled
                class="inline-flex items-center gap-3 bg-btn-disabled text-btn-disabled font-semibold px-8 py-3 rounded-xl cursor-not-allowed text-lg"
                aria-label="Instalação não disponível no momento">
                <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {{ pwaService.installLabel() }}
              </button>
              @if (pwaService.platform() === 'ios') {
                <p class="text-xs text-muted">
                  Toque em Compartilhar &rarr; Adicionar à Tela de Início
                </p>
              } @else if (pwaService.platform() === 'android') {
                <p class="text-xs text-muted">
                  Disponível no Chrome. Toque em "Instalar" quando aparecer.
                </p>
              } @else {
                <p class="text-xs text-muted">
                  Disponível via Chrome, Edge ou Safari. Instale pelo menu do navegador.
                </p>
              }
            </div>
          }

        </div>
      </section>

      <footer class="border-t border-theme py-12 px-6 md:px-16 lg:px-24" role="contentinfo">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <img src="doheem_logo.png" alt="Doheem" loading="lazy" class="h-8 w-auto rounded-xl" />
              <span class="text-primary font-bold text-xl">Doheem</span>
            </div>
            <p class="text-sm text-secondary max-w-sm leading-relaxed">
              Sua plataforma de gestão da casa. Organize despesas, divida contas
              e coordene tarefas com seus amigos e familiares.
            </p>
          </div>

          <div>
            <h3 class="text-primary font-semibold text-sm mb-4" id="footer-nav-heading">Navegação</h3>
            <nav aria-labelledby="footer-nav-heading">
              <ul class="flex flex-col gap-2">
                <li><a href="#inicio" class="text-sm text-secondary hover:text-accent transition-colors">Início</a></li>
                <li><a href="#sobre" class="text-sm text-secondary hover:text-accent transition-colors">Sobre</a></li>
                <li><a href="#depoimentos" class="text-sm text-secondary hover:text-accent transition-colors">Depoimentos</a></li>
                <li><a href="#app" class="text-sm text-secondary hover:text-accent transition-colors">App</a></li>
              </ul>
            </nav>
          </div>

          <div>
            <h3 class="text-primary font-semibold text-sm mb-4" id="footer-links-heading">Links</h3>
            <nav aria-labelledby="footer-links-heading">
              <ul class="flex flex-col gap-2">
                <li><a href="/login" class="text-sm text-secondary hover:text-accent transition-colors">Entrar</a></li>
                <li><a href="/register" class="text-sm text-secondary hover:text-accent transition-colors">Registrar</a></li>
              </ul>
            </nav>
          </div>

        </div>

        <div class="max-w-7xl mx-auto mt-12 pt-6 border-t border-soft text-center">
          <p class="text-xs text-muted">
            &copy; 2026 Doheem. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </div>
  `,
})
export class HomePage {
  protected pwaService = inject(PwaInstallService);

  private animatedSections = viewChildren<ElementRef<HTMLElement>>('animateSection');

  protected depoimentos = [
    {
      nome: 'Ana Clara',
      cidade: 'São Paulo, SP',
      texto: 'O Doheem salvou nossa república! Chega de planilhas no Excel e cobranças pelo grupo do WhatsApp. Agora tudo fica registrado e transparente.',
      iniciais: 'AC',
      cor: 'bg-violet-600',
    },
    {
      nome: 'Rafael Oliveira',
      cidade: 'Campinas, SP',
      texto: 'Dividir contas nunca foi tão fácil. O Doheem calcula os rateios automaticamente e ainda mostra quem está devendo. Simplesmente essencial.',
      iniciais: 'RO',
      cor: 'bg-emerald-600',
    },
    {
      nome: 'Juliana Santos',
      cidade: 'Belo Horizonte, MG',
      texto: 'A organização das tarefas domésticas mudou completamente. Cada um sabe o que precisa fazer e não tem mais discussão sobre quem limpou o quê.',
      iniciais: 'JS',
      cor: 'bg-amber-600',
    },
  ];

  constructor() {
    afterNextRender(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.15 },
      );

      for (const el of this.animatedSections()) {
        observer.observe(el.nativeElement);
      }
    });
  }
}
