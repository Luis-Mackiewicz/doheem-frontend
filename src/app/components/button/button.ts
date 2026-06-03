import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <ng-container [ngSwitch]="type">
      <a *ngSwitchCase="'link'"
         [attr.href]="href"
         [class]="(variant === 'solid'
           ? 'inline-flex items-center justify-center gap-3 bg-violet-800 text-white font-semibold rounded-xl hover:bg-violet-600 transition shadow-lg'
           : 'inline-flex items-center justify-center gap-3 border border-theme text-primary font-semibold rounded-xl hover-bg transition backdrop-blur-sm')
           + (size === 'small' ? ' px-3 py-1 text-xs' : ' px-8 py-3')">
        {{ label }}
      </a>
      <button *ngSwitchDefault
              [type]="type"
              [class]="(variant === 'solid'
                ? 'inline-flex items-center justify-center gap-3 bg-white text-purple-dark font-semibold rounded-xl hover:bg-violet-600 transition shadow-lg cursor-pointer'
                : 'inline-flex items-center justify-center gap-3 border border-theme text-primary font-semibold rounded-xl hover-bg transition backdrop-blur-sm cursor-pointer')
                + (size === 'small' ? ' px-3 py-1 text-xs' : ' px-8 py-3 w-full')">
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
  @Input() size: 'normal' | 'small' = 'normal';
}
