import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'input[appCepMask]',
  standalone: true,
})
export class CepMaskDirective {
  private el = inject(ElementRef<HTMLInputElement>);

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    const pos = input.selectionStart ?? 0;
    const lenBefore = input.value.length;

    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    input.value = this.applyMask(digits);

    const posAfter = this.adjustCursor(pos, lenBefore, input.value.length);
    input.setSelectionRange(posAfter, posAfter);
  }

  private applyMask(d: string): string {
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }

  private adjustCursor(before: number, oldLen: number, newLen: number): number {
    return Math.max(0, before + (newLen - oldLen));
  }
}
