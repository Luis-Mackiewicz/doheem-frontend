import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

interface Country {
  name: string;
  flag: string;
  ddd: string;
}

const COUNTRIES: Country[] = [
  { name: 'Brasil', flag: '🇧🇷', ddd: '55' },
  { name: 'Portugal', flag: '🇵🇹', ddd: '351' },
  { name: 'Estados Unidos', flag: '🇺🇸', ddd: '1' },
  { name: 'Argentina', flag: '🇦🇷', ddd: '54' },
  { name: 'Espanha', flag: '🇪🇸', ddd: '34' },
  { name: 'França', flag: '🇫🇷', ddd: '33' },
  { name: 'Itália', flag: '🇮🇹', ddd: '39' },
  { name: 'Reino Unido', flag: '🇬🇧', ddd: '44' },
];

@Component({
  selector: 'app-phone-input',
  template: `
    <div class="relative flex items-stretch bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden focus-within:border-white/50 transition">
      <button type="button" (click)="toggleDropdown()"
        class="flex items-center gap-1.5 px-3 py-3 text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer text-sm shrink-0 border-r border-white/10">
        <span>{{ selected().flag }}</span>
        <span class="text-xs">▾</span>
      </button>

      @if (open()) {
        <div class="absolute top-full left-0 mt-1 w-56 bg-purple-dark border border-white/10 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden">
          <div class="max-h-48 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            @for (country of countries; track country.ddd + country.name) {
              <button type="button" (click)="select(country)"
                class="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-white/70 hover:text-white hover:bg-white/5 transition cursor-pointer"
                [class.bg-white/5]="country.ddd === selected().ddd && country.name === selected().name">
                <span class="text-lg">{{ country.flag }}</span>
                <span class="flex-1">{{ country.name }}</span>
                <span class="text-white/40 text-xs">+{{ country.ddd }}</span>
              </button>
            }
          </div>
        </div>
      }

      <span class="flex items-center px-3 text-white/50 text-sm shrink-0 border-r border-white/10">+{{ selected().ddd }}</span>

      <input type="tel" [value]="numberValue" (input)="onNumberInput($event)" (blur)="onBlur()"
        placeholder="(11) 99999-0000"
        class="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/40 outline-none text-sm" />
    </div>
  `,
})
export class PhoneInputComponent {
  @Input() value = '';
  @Output() phoneChange = new EventEmitter<string>();

  protected countries = COUNTRIES;
  protected selected = signal(COUNTRIES[0]);
  protected open = signal(false);
  protected numberValue = '';

  private parseInitial(value: string): void {
    if (!value) return;
    const clean = value.replace(/\D/g, '');
    for (const c of this.countries) {
      if (clean.startsWith(c.ddd)) {
        this.selected.set(c);
        this.numberValue = clean.slice(c.ddd.length);
        return;
      }
    }
    this.numberValue = clean;
  }

  ngOnInit(): void {
    this.parseInitial(this.value);
  }

  toggleDropdown(): void {
    this.open.update(v => !v);
  }

  select(country: Country): void {
    this.selected.set(country);
    this.open.set(false);
    this.emit();
  }

  onNumberInput(e: Event): void {
    this.numberValue = (e.target as HTMLInputElement).value;
    this.emit();
  }

  onBlur(): void {
    setTimeout(() => this.open.set(false), 200);
  }

  private emit(): void {
    const raw = this.selected().ddd + this.numberValue.replace(/\D/g, '');
    this.phoneChange.emit(raw);
  }
}
