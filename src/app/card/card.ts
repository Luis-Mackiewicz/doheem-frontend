import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div class="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-10">
      <ng-content />
    </div>
  `,
})
export class CardComponent {}
