import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <a [attr.href]="href"
       [class]="variant === 'solid'
         ? 'inline-flex items-center bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg'
         : 'inline-flex items-center border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition backdrop-blur-sm'">
      <ng-content />
    </a>
  `,
})
export class ButtonComponent {
  @Input() variant: 'solid' | 'outline' = 'solid';
  @Input() href = '#';
}
