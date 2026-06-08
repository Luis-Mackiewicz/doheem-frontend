import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'input[appCnpjMask]',
  standalone: true,
})
export class CnpjMaskDirective {
  private el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const pos = input.selectionStart ?? 0;
    const lenBefore = input.value.length;

    const digits = input.value.replace(/\D/g, '').slice(0, 14);
    input.value = this.applyMask(digits);

    const posAfter = this.adjustCursor(pos, lenBefore, input.value.length);
    input.setSelectionRange(posAfter, posAfter);
  }

  private applyMask(d: string): string {
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  }

  private adjustCursor(before: number, oldLen: number, newLen: number): number {
    return Math.max(0, before + (newLen - oldLen));
  }
}
