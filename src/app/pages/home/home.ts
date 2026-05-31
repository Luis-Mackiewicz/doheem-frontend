import { Component } from '@angular/core';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-home',
  imports: [ButtonComponent],
  template: `
    <section class="min-h-dvh flex flex-col justify-center bg-linear-to-br from-purple-dark to-purple-medium text-white">

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
  `,
})
export class HomePage {}
