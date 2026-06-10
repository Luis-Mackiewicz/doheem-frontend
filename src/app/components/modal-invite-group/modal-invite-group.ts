import { Component, EventEmitter, Input, Output, signal, computed, OnInit } from '@angular/core';
import QRCode from 'qrcode';
import { CardComponent } from '../card/card';
import { ButtonComponent } from '../button/button';
import { LucideX, LucideQrCode, LucideRefreshCw } from '@lucide/angular';
import { Group } from '../../services/mock-data.service';

@Component({
  selector: 'app-modal-invite-group',
  imports: [CardComponent, ButtonComponent, LucideX, LucideQrCode, LucideRefreshCw],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div (click)="$event.stopPropagation()" class="w-full max-w-md">
        <app-card customClass="gap-5">
          <div class="flex items-center justify-between">
            <h2 class="text-primary font-bold text-lg">Convidar para o grupo</h2>
            <button (click)="close.emit()" aria-label="Fechar" class="text-muted hover-text-primary transition cursor-pointer">
              <svg lucideX class="w-5 h-5"></svg>
            </button>
          </div>

          @if (!selectedGroup()) {
            <label class="flex flex-col gap-1.5 text-sm font-medium text-secondary">
              Selecione o grupo
              <select (change)="onGroupSelect($event)"
                class="bg-input border-theme rounded-xl px-4 py-3 text-primary outline-none focus:border-purple-400/60 transition w-full appearance-none cursor-pointer">
                <option value="" selected class="bg-card text-muted">Escolher grupo...</option>
                @for (g of groups; track g.id) {
                  <option [value]="g.id" class="bg-card text-primary">{{ g.name }}</option>
                }
              </select>
            </label>
          } @else {
            <div class="flex flex-col items-center gap-3">
              <div class="flex items-center gap-2 w-full">
                <span class="text-sm text-secondary">Grupo:</span>
                <span class="text-sm text-primary font-semibold">{{ selectedGroup()?.name }}</span>
                @if (!groupId) {
                  <button (click)="resetSelection()" title="Trocar de grupo" class="ml-auto text-muted hover-text-primary transition cursor-pointer">
                    <svg lucideRefreshCw class="w-4 h-4"></svg>
                  </button>
                }
              </div>

              <div class="bg-white p-3 rounded-2xl">
                @if (qrCodeDataUrl(); as url) {
                  <img [src]="url" alt="QR Code de convite" class="w-48 h-48" />
                } @else {
                  <div class="w-48 h-48 bg-card-hover rounded-xl flex items-center justify-center">
                    <svg lucideQrCode class="w-12 h-12 text-muted"></svg>
                  </div>
                }
              </div>
              <p class="text-secondary text-xs text-center">Compartilhe o link abaixo para convidar pessoas para o grupo</p>
            </div>

            <div class="flex gap-2">
              <input type="text" [value]="inviteLink()" readonly
                class="flex-1 bg-input border-theme rounded-xl px-4 py-3 text-primary text-sm outline-none truncate" />
              <button type="button" (click)="copyLink()"
                [class]="copied()
                  ? 'shrink-0 inline-flex items-center justify-center gap-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-semibold rounded-xl transition backdrop-blur-sm cursor-pointer px-5 py-3 text-sm'
                  : 'shrink-0 inline-flex items-center justify-center gap-2 border border-theme text-primary font-semibold rounded-xl hover-bg transition backdrop-blur-sm cursor-pointer px-5 py-3 text-sm'">
                {{ copied() ? 'Copiado!' : 'Copiar' }}
              </button>
            </div>

            <app-button type="button" variant="solid" label="Compartilhar" (click)="shareLink()" />
          }
        </app-card>
      </div>
    </div>
  `,
})
export class ModalInviteGroupComponent implements OnInit {
  @Input({ required: true }) groups: Group[] = [];
  @Input() groupId?: string;
  @Output() close = new EventEmitter<void>();

  protected readonly selectedGroupId = signal('');
  protected readonly selectedGroup = computed(() => {
    const id = this.selectedGroupId();
    if (!id) return null;
    return this.groups.find(g => g.id === id) ?? { id, name: 'Grupo atual' } as Group;
  });
  protected readonly inviteLink = computed(() =>
    this.selectedGroupId()
      ? `${window.location.origin}/groups/join/${this.selectedGroupId()}`
      : ''
  );
  protected readonly qrCodeDataUrl = signal<string>('');
  protected readonly copied = signal(false);

  ngOnInit(): void {
    if (this.groupId) {
      this.selectGroup(this.groupId);
    }
  }

  onGroupSelect(event: Event): void {
    const id = (event.target as HTMLSelectElement).value;
    if (!id) return;
    this.selectGroup(id);
  }

  private selectGroup(id: string): void {
    this.selectedGroupId.set(id);
    this.qrCodeDataUrl.set('');
    QRCode.toDataURL(this.inviteLink(), {
      width: 400,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    }).then(url => this.qrCodeDataUrl.set(url)).catch(() => {});
  }

  resetSelection(): void {
    this.selectedGroupId.set('');
    this.qrCodeDataUrl.set('');
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.inviteLink()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {});
  }

  shareLink(): void {
    if (navigator.share) {
      navigator.share({ title: 'Convidar para grupo', text: 'Entre no grupo pelo link:', url: this.inviteLink() }).catch(() => {});
    } else {
      this.copyLink();
    }
  }
}
