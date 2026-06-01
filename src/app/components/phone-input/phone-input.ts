import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-phone-input',
  template: `
    <input type="tel" [value]="value" (input)="onInput($event)" placeholder="(11) 99999-0000"
      class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full" />
  `,
})
export class PhoneInputComponent {
  @Input() value = '';
  @Output() phoneChange = new EventEmitter<string>();

  onInput(e: Event): void {
    this.phoneChange.emit((e.target as HTMLInputElement).value);
  }
}
