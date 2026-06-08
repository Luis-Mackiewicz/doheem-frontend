import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-phone-input',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PhoneInputComponent), multi: true },
  ],
  template: `
    <input type="tel" [value]="value" (input)="onInput($event)" (blur)="onBlur()" [disabled]="disabled"
      placeholder="(11) 99999-0000"
      class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full" />
  `,
})
export class PhoneInputComponent implements ControlValueAccessor {
  protected value = '';
  protected disabled = false;

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void {
    this.value = v ?? '';
  }

  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const pos = input.selectionStart ?? 0;
    const lenBefore = input.value.length;

    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    const formatted = this.applyMask(digits);
    input.value = formatted;
    this.value = digits;

    const posAfter = Math.max(0, pos + (formatted.length - lenBefore));
    input.setSelectionRange(posAfter, posAfter);

    this.onChange(digits);
  }

  onBlur(): void {
    this.onTouched();
  }

  private applyMask(d: string): string {
    if (!d) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }
}
