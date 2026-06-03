import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-search',
  imports: [LucideSearch],
  template: `
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted select-none"><svg lucideSearch class="w-4 h-4"></svg></span>
      <input #input type="text" [placeholder]="placeholder"
        class="w-full bg-input border border-theme rounded-xl pl-10 pr-4 py-3 text-primary outline-none focus:border-purple-400/60 transition"
        (input)="onInput(input.value)" />
    </div>
  `,
})
export class BuscaComponent {
  @Input() placeholder = 'Pesquisar...';
  @Output() searchChange = new EventEmitter<string>();

  protected onInput(value: string): void {
    this.searchChange.emit(value);
  }
}
