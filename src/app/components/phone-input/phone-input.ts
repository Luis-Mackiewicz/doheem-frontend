import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-phone-input',
  template: `
    <input type="tel" [value]="value" (input)="onInput($event)" placeholder="(11) 99999-0000"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 transition w-full" />
  `,
})
export class PhoneInputComponent {
  @Input() value = '';
  @Output() phoneChange = new EventEmitter<string>();

  onInput(e: Event): void {
    this.phoneChange.emit((e.target as HTMLInputElement).value);
  }
}
