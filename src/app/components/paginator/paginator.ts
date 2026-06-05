import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';

@Component({
  selector: 'app-paginator',
  imports: [LucideChevronLeft, LucideChevronRight],
  template: `
    <div class="flex items-center justify-center gap-1 mt-auto px-4 py-3 border-t border-theme">
      @if (totalPages > 1) {
        <button (click)="goTo(currentPage - 1)"
          [class.opacity-30]="currentPage === 1"
          [disabled]="currentPage === 1"
          class="text-secondary hover:text-primary transition px-2 py-1 text-sm disabled:cursor-default">
          <svg lucideChevronLeft class="w-4 h-4"></svg>
        </button>
        @for (page of visiblePages; track page) {
          <button (click)="goTo(page)"
            [class]="page === currentPage
              ? 'bg-white text-purple-dark font-semibold rounded-lg px-3 py-1 text-sm'
              : 'text-secondary hover:text-primary transition rounded-lg px-3 py-1 text-sm'">
            {{ page }}
          </button>
        }
        <button (click)="goTo(currentPage + 1)"
          [class.opacity-30]="currentPage === totalPages"
          [disabled]="currentPage === totalPages"
          class="text-secondary hover:text-primary transition px-2 py-1 text-sm disabled:cursor-default">
          <svg lucideChevronRight class="w-4 h-4"></svg>
        </button>
      }
    </div>
  `,
})
export class PaginatorComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  protected goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
