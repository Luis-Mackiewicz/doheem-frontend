import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'input[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
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
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }

  private adjustCursor(before: number, oldLen: number, newLen: number): number {
    return Math.max(0, before + (newLen - oldLen));
  }
}
