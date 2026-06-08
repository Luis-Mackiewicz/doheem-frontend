import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'input[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  private el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const pos = input.selectionStart ?? 0;
    const lenBefore = input.value.length;

    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    input.value = this.applyMask(digits);

    const posAfter = this.adjustCursor(pos, lenBefore, input.value.length);
    input.setSelectionRange(posAfter, posAfter);
  }

  private applyMask(d: string): string {
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  private adjustCursor(before: number, oldLen: number, newLen: number): number {
    return Math.max(0, before + (newLen - oldLen));
  }
}
