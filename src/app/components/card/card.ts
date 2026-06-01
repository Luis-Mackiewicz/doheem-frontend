import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  template: `
    <div [class]="'w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 md:p-10 flex flex-col ' + customClass">
      <ng-content />
    </div>
  `,
})
export class CardComponent {
  @Input() customClass = '';
}
