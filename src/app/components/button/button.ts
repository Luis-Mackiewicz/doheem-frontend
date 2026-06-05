import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <ng-container [ngSwitch]="type">
      <a *ngSwitchCase="'link'"
         [attr.href]="disabled ? undefined : href"
         [class]="(variant === 'solid'
           ? 'inline-flex items-center justify-center gap-3 bg-violet-800 text-white font-semibold rounded-xl hover:bg-violet-600 hover:text-white transition shadow-lg'
           : 'inline-flex items-center justify-center gap-3 border border-theme text-primary font-semibold rounded-xl hover-bg transition backdrop-blur-sm')
           + (size === 'small' ? ' px-3 py-1 text-xs' : ' px-8 py-3')
           + (disabled ? ' opacity-50 pointer-events-none' : '')">
        @if (loading) {
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        }
        {{ label }}
      </a>
      <button *ngSwitchDefault
              [type]="type"
              [disabled]="disabled"
              [class]="(variant === 'solid'
                ? 'inline-flex items-center justify-center gap-3 bg-white text-purple-dark font-semibold rounded-xl hover:bg-violet-600 hover:text-white transition shadow-lg cursor-pointer'
                : 'inline-flex items-center justify-center gap-3 border border-theme text-primary font-semibold rounded-xl hover-bg transition backdrop-blur-sm cursor-pointer')
                + (size === 'small' ? ' px-3 py-1 text-xs' : ' px-8 py-3 w-full')
                + (disabled ? ' opacity-50 pointer-events-none' : '')">
        @if (loading) {
          <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        }
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
  @Input() disabled = false;
  @Input() loading = false;
}
