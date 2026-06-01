import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-password-input',
  template: `
    <div class="relative">
      <input [type]="visible ? 'text' : 'password'" [value]="value" (input)="onInput($event)"
        [placeholder]="placeholder"
        class="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition pr-12" />
      <button type="button" (click)="toggle()"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition cursor-pointer">
        @if (visible) {
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
          </svg>
        } @else {
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      </button>
    </div>
  `,
})
export class PasswordInputComponent {
  @Input() value = '';
  @Input() placeholder = '••••••••';
  @Output() valueChange = new EventEmitter<string>();

  protected visible = false;

  toggle(): void {
    this.visible = !this.visible;
  }

  onInput(e: Event): void {
    this.valueChange.emit((e.target as HTMLInputElement).value);
  }
}
