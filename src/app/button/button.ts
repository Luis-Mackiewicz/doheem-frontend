import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    @if (type === 'link') {
      <a [attr.href]="href"
         [class]="variant === 'solid'
           ? 'inline-flex items-center justify-center gap-3 bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg'
           : 'inline-flex items-center justify-center gap-3 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition backdrop-blur-sm'">
        <ng-content />
      </a>
    } @else {
      <button [type]="type"
              [class]="variant === 'solid'
                ? 'inline-flex items-center justify-center gap-3 bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg cursor-pointer'
                : 'inline-flex items-center justify-center gap-3 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition backdrop-blur-sm cursor-pointer'">
        <ng-content />
      </button>
    }
  `,
})
export class ButtonComponent {
  @Input() variant: 'solid' | 'outline' = 'solid';
  @Input() href = '#';
  @Input() type: 'link' | 'submit' | 'button' = 'link';
}
