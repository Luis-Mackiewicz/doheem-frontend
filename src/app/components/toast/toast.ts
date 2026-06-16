import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed top-4 right-4 z-100 flex flex-col gap-2 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div role="alert"
          class="pointer-events-auto animate-slide-in-right flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-xl text-sm font-medium max-w-sm transition cursor-pointer hover:opacity-90"
          [class.bg-red-900/90]="toast.type === 'error'"
          [class.border-red-500/40]="toast.type === 'error'"
          [class.text-red-200]="toast.type === 'error'"
          [class.bg-emerald-900/90]="toast.type === 'success'"
          [class.border-emerald-500/40]="toast.type === 'success'"
          [class.text-emerald-200]="toast.type === 'success'"
          [class.bg-neutral-800/90]="toast.type === 'info'"
          [class.border-white/10]="toast.type === 'info'"
          [class.text-white]="toast.type === 'info'"
          (click)="toastService.dismiss(toast.id)">
          @switch (toast.type) {
            @case ('error') {
              <svg class="w-5 h-5 shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            }
            @case ('success') {
              <svg class="w-5 h-5 shrink-0 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            }
            @default {
              <svg class="w-5 h-5 shrink-0 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            }
          }
          <span class="flex-1">{{ toast.message }}</span>
          <button (click)="toastService.dismiss(toast.id); $event.stopPropagation()" class="shrink-0 opacity-60 hover:opacity-100 transition cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in-right {
      animation: slide-in-right 0.25s ease-out;
    }
  `],
})
export class ToastComponent {
  protected toastService = inject(ToastService);
}
