import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent],
  template: `
    <section id="inicio" class="min-h-dvh flex flex-col justify-center bg-linear-to-br from-purple-dark to-purple-medium text-white">

      <div class="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12 px-6 md:px-16 lg:px-24 py-16">

        <div class="flex flex-col gap-6 order-2 md:order-1">
          <span class="text-sm font-semibold tracking-[0.2em] uppercase text-white/60">
            Gestão compartilhada
          </span>

          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            O lar das suas<br />
            <span class="text-white">finanças e tarefas</span>
          </h1>

          <p class="text-lg md:text-xl text-white/70 max-w-lg leading-relaxed">
            Organize despesas, divida contas e coordene tarefas com seus colegas de república.
            Tudo em um só lugar, simples e pensado para estudantes.
          </p>

          <div class="flex flex-wrap gap-4 mt-2">
            <app-button variant="solid" href="/login" label="Entrar"></app-button>
            <app-button variant="outline" href="/register" label="Registrar"></app-button>
          </div>
        </div>

        <div class="flex justify-center items-center order-1 md:order-2">
          <div class="w-full max-w-md aspect-square rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center gap-6 p-8">
            <div class="flex gap-8 text-5xl">
              <span class="bg-white/10 backdrop-blur-sm rounded-2xl p-5">💰</span>
              <span class="bg-white/10 backdrop-blur-sm rounded-2xl p-5">📋</span>
            </div>
            <p class="text-white/50 text-center text-sm tracking-wide">
              Despesas &bull; Tarefas &bull; Moradores
            </p>
            <div class="w-3/4 h-px bg-white/10"></div>
            <p class="text-white/40 text-center text-xs max-w-[220px] leading-relaxed">
              Tudo o que sua república precisa em um só painel
            </p>
          </div>
        </div>

      </div>

    </section>

    <section id="sobre" class="min-h-dvh flex flex-col justify-center bg-white text-purple-dark">
      <div class="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16 px-6 md:px-16 lg:px-24 py-24">

        <div class="flex flex-col gap-6">
          <span class="text-sm font-semibold tracking-[0.2em] uppercase text-purple-dark/50">Sobre</span>
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight text-purple-dark">O que é o Doheem?</h2>
          <p class="text-lg text-purple-dark/60 leading-relaxed">
            Doheem é uma plataforma completa para gestão de repúblicas estudantis.
            Com ela, você organiza despesas, divide contas, coordena tarefas domésticas
            e mantém tudo transparente entre os moradores.
          </p>
          <p class="text-lg text-purple-dark/60 leading-relaxed">
            Chega de planilhas perdidas e conversas no WhatsApp. Tudo centralizado,
            simples e pensado para facilitar o dia a dia da sua república.
          </p>
        </div>

        <div class="flex justify-center items-center">
          <div class="w-full max-w-md aspect-square rounded-3xl bg-purple-dark/5 backdrop-blur-xl border border-purple-dark/10 shadow-2xl flex flex-col items-center justify-center gap-6 p-8">
            <div class="flex gap-8 text-5xl">
              <span class="bg-purple-dark/10 backdrop-blur-sm rounded-2xl p-5">💰</span>
              <span class="bg-purple-dark/10 backdrop-blur-sm rounded-2xl p-5">📋</span>
            </div>
            <p class="text-purple-dark/50 text-center text-sm tracking-wide">
              Despesas &bull; Tarefas &bull; Moradores
            </p>
            <div class="w-3/4 h-px bg-purple-dark/10"></div>
            <p class="text-purple-dark/40 text-center text-xs max-w-[220px] leading-relaxed">
              Tudo o que sua república precisa em um só painel
            </p>
          </div>
        </div>

      </div>
    </section>

    <section id="app" class="min-h-dvh flex flex-col justify-center bg-linear-to-br from-purple-dark to-purple-medium text-white">
      <div class="max-w-7xl mx-auto w-full flex flex-col items-center text-center px-6 md:px-16 lg:px-24 py-24">

        <span class="text-sm font-semibold tracking-[0.2em] uppercase text-white/60 mb-4">Aplicativo</span>
        <h2 class="text-3xl md:text-4xl font-extrabold leading-tight text-white mb-4">Baixe o Doheem</h2>
        <p class="text-lg text-white/70 max-w-xl leading-relaxed mb-8">
          Instale o Doheem no seu celular ou computador e tenha acesso rápido
          a todas as funcionalidades. Funciona como um aplicativo nativo,
          direto do seu navegador.
        </p>

        <button
          class="inline-flex items-center gap-3 bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg cursor-pointer text-lg">
          📲 Instalar App
        </button>
        <p class="text-white/40 text-sm mt-4">Disponível para Android, iOS e Desktop</p>

      </div>
    </section>
  `,
})
export class HomePage {}
