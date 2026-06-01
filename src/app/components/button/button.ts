import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <ng-container [ngSwitch]="type">
      <a *ngSwitchCase="'link'"
         [attr.href]="href"
         [class]="variant === 'solid'
           ? 'inline-flex items-center justify-center gap-3 bg-violet-900 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg'
           : 'inline-flex items-center justify-center gap-3 border-theme text-primary font-semibold px-8 py-3 rounded-xl hover-bg transition backdrop-blur-sm'">
        {{ label }}
      </a>
      <button *ngSwitchDefault
              [type]="type"
              [class]="variant === 'solid'
                ? 'inline-flex items-center justify-center gap-3 bg-white text-purple-dark font-semibold px-8 py-3 rounded-xl hover:bg-white/90 transition shadow-lg cursor-pointer w-full'
                : 'inline-flex items-center justify-center gap-3 border-theme text-primary font-semibold px-8 py-3 rounded-xl hover-bg transition backdrop-blur-sm cursor-pointer w-full'">
        {{ label }}
      </button>
    </ng-container>
  `,
})
export class ButtonComponent {
  @Input() label = '';
  @Input() variant: 'solid' | 'outline' = 'solid';
  @Input() href = '#';
  @Input() type: 'link' | 'submit' | 'button' = 'link';
}
