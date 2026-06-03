import { Injectable, signal, computed } from '@angular/core';

export type Platform = 'ios' | 'android' | 'desktop';

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferredPrompt: any = null;
  readonly canInstall = signal(false);
  readonly platform = signal<Platform>(this.detectPlatform());

  readonly installLabel = computed(() => {
    switch (this.platform()) {
      case 'ios': return 'Instalar no iPhone';
      case 'android': return 'Instalar no Android';
      default: return 'Instalar App';
    }
  });

  private detectPlatform(): Platform {
    if (typeof navigator === 'undefined') return 'desktop';
    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
    if (/android/i.test(ua)) return 'android';
    return 'desktop';
  }

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        this.deferredPrompt = e;
        this.canInstall.set(true);
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.canInstall.set(false);
      });
    }
  }

  install(): void {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then(() => {
      this.deferredPrompt = null;
      this.canInstall.set(false);
    });
  }
}
