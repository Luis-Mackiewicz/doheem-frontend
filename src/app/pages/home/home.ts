import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent],
  template: `
    <div class="bg-page text-white">
      <section id="inicio" class="min-h-dvh flex flex-col justify-center">

        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 px-6 md:px-16 lg:px-24 py-16">

          <div class="flex flex-col gap-6 order-2 md:order-1">
            <span class="text-sm font-semibold tracking-[0.2em] uppercase text-secondary">
              Gestão compartilhada
            </span>

            <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              O lar das suas<br />
              <span class="text-white">finanças e tarefas</span>
            </h1>

            <p class="text-lg md:text-xl text-secondary max-w-lg leading-relaxed">
              Organize despesas, divida contas e coordene tarefas com seus colegas de república.
              Tudo em um só lugar, simples e pensado para estudantes.
            </p>

            <div class="flex flex-wrap gap-4 mt-2">
              <app-button variant="solid" href="/login" label="Entrar"></app-button>
              <app-button variant="outline" href="/register" label="Registrar"></app-button>
            </div>
          </div>

          <div class="flex justify-center items-center order-1 md:order-2">
            <div class="w-full max-w-md aspect-square rounded-3xl bg-card border-theme shadow-2xl flex flex-col items-center justify-center gap-6 p-8">
              <div class="flex gap-8 text-5xl">
                <span class="bg-card p-5">💰</span>
                <span class="bg-card p-5">📋</span>
              </div>
              <p class="text-muted text-center text-sm tracking-wide">
                Despesas &bull; Tarefas &bull; Moradores
              </p>
              <div class="w-3/4 h-px bg-white/10"></div>
              <p class="text-muted text-center text-xs max-w-[220px] leading-relaxed">
                Tudo o que sua república precisa em um só painel
              </p>
            </div>
          </div>

        </div>

      </section>

      <section id="sobre" class="min-h-dvh flex flex-col justify-center">
        <div class="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16 px-6 md:px-16 lg:px-24 py-24">

          <div class="flex flex-col gap-6">
            <span class="text-sm font-semibold tracking-[0.2em] uppercase text-secondary">Sobre</span>
            <h2 class="text-3xl md:text-4xl font-extrabold leading-tight">O que é o Doheem?</h2>
            <p class="text-lg text-secondary leading-relaxed">
              Doheem é uma plataforma completa para gestão de repúblicas estudantis.
              Com ela, você organiza despesas, divide contas, coordena tarefas domésticas
              e mantém tudo transparente entre os moradores.
            </p>
            <p class="text-lg text-secondary leading-relaxed">
              Chega de planilhas perdidas e conversas no WhatsApp. Tudo centralizado,
              simples e pensado para facilitar o dia a dia da sua república.
            </p>
          </div>

          <div class="flex justify-center items-center">
            <div class="w-full max-w-md aspect-square rounded-3xl bg-card border-theme shadow-2xl flex flex-col items-center justify-center gap-6 p-8">
              <div class="flex gap-8 text-5xl">
                <span class="bg-card p-5">💰</span>
                <span class="bg-card p-5">📋</span>
              </div>
              <p class="text-muted text-center text-sm tracking-wide">
                Despesas &bull; Tarefas &bull; Moradores
              </p>
              <div class="w-3/4 h-px bg-white/10"></div>
              <p class="text-muted text-center text-xs max-w-[220px] leading-relaxed">
                Tudo o que sua república precisa em um só painel
              </p>
            </div>
          </div>

        </div>
      </section>

      <section id="app" class="min-h-dvh flex flex-col justify-center">
        <div class="max-w-7xl mx-auto w-full flex flex-col items-center text-center px-6 md:px-16 lg:px-24 py-24">

          <span class="text-sm font-semibold tracking-[0.2em] uppercase text-secondary mb-4">Aplicativo</span>
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight mb-4">Baixe o Doheem</h2>
          <p class="text-lg text-secondary max-w-xl leading-relaxed mb-8">
            Instale o Doheem no seu celular ou computador e tenha acesso rápido
            a todas as funcionalidades. Funciona como um aplicativo nativo,
            direto do seu navegador.
          </p>

          <button
            class="inline-flex items-center gap-3 bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg cursor-pointer text-lg">
            📲 Instalar App
          </button>
          <p class="text-muted text-sm mt-4">Disponível para Android, iOS e Desktop</p>

        </div>
      </section>
    </div>
  `,
})
export class HomePage {}
